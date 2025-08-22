// src/components/UniverseImage.tsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';

interface UniverseImageProps {
  universeId: string;
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  grade?: number;
}

export function UniverseImage({
  universeId,
  title,
  subject,
  className = '',
  alt,
  grade,
}: UniverseImageProps) {
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;

  const parseExactGrade = (g?: string | number) =>
    Math.min(12, Math.max(1, Number(String(g).match(/\d+/)?.[0]) || 7));

  const resolvedGrade =
    parseExactGrade(metadata?.grade_level) ||
    parseExactGrade(metadata?.age ? metadata.age - 6 : undefined) ||
    6;

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
  const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY!;
  const storageBase = `${SUPABASE_URL}/storage/v1/object/public/universe-images`;

  // encode each segment safely
  const safeId = encodeURIComponent(universeId);
  const coverUrlNoBust = `${storageBase}/${safeId}/${resolvedGrade}/cover.webp`;
  const withBust = (u: string) => `${u}?v=${Date.now()}`;

  // Functions base for public SVG fallback
  const FUNCTIONS_BASE = SUPABASE_URL.replace('supabase.co', 'functions.supabase.co');
  function coverGeneratorURL(t: string, author = 'NELIE') {
    const u = new URL(`${FUNCTIONS_BASE}/cover-generator`);
    u.searchParams.set('title', t || 'Untitled');
    u.searchParams.set('author', author);
    u.searchParams.set('bg', '264653');
    u.searchParams.set('color', 'ffffff');
    u.searchParams.set('v', String(Date.now())); // cache-bust
    return u.toString();
  }

  const fallbackUrl = useMemo(() => coverGeneratorURL(title), [title]);
  const [src, setSrc] = useState<string>(fallbackUrl);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      attempt += 1;
      try {
        // Use cheap byte-range GET (works where HEAD may 400)
        const res = await fetch(coverUrlNoBust, {
          method: 'GET',
          headers: { Range: 'bytes=0-0' },
          cache: 'no-store',
        });
        if ((res.status === 200 || res.status === 206) && !cancelled) {
          setSrc(withBust(coverUrlNoBust)); // swap to real image with cache-buster
          return;
        }
      } catch {
        // ignore and retry
      }
      // exponential backoff up to ~30s
      const delay = Math.min(30000, Math.round(800 * Math.pow(1.7, attempt)));
      timer = setTimeout(check, delay);
    };

    // 1) show fallback immediately
    setSrc(fallbackUrl);

    // 2) queue generation (fire-and-forget)
    supabase.functions
      .invoke('image-ensure', {
        body: {
          universeId,
          universeTitle: title,
          subject: subject || 'educational',
          scene: 'cover: main activity',
          grade: resolvedGrade,
        },
        headers: {
          apikey: ANON, // some deployments expect this along with Authorization
        },
      })
      .then(({ data, error }) => {
        if (cancelled || error) {
          console.log('🔄 Image generation queued or failed:', error);
          return;
        }
        console.log('✅ Image generation queued:', data);
      })
      .catch((error) => {
        console.log('🔄 Generation failed:', error);
      });

    // 3) start polling
    check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [coverUrlNoBust, fallbackUrl, universeId, title, subject, grade]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt || title}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        decoding="async"
        onError={() => setSrc(fallbackUrl)}
        style={{ width: '100%', height: '100%' }}
      />

      {import.meta.env.DEV && (
        <div className="absolute top-2 right-2 text-xs flex gap-1">
          <span className="bg-blue-500 text-white px-1 rounded text-xs">G{resolvedGrade}</span>
        </div>
      )}
    </div>
  );
}
