import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { publicOrSignedUrl } from '@/utils/storageUrls';

interface UniverseImageProps {
  universeId: string;              // MUST be the UUID
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  grade?: number;                  // optional hard lock
}

function parseExactGrade(g?: string | number) {
  const n = Number(String(g ?? '').match(/\d+/)?.[0]);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(12, Math.max(1, n));
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

  // single-grade resolution (prefers explicit prop)
  const resolvedGrade =
    grade ??
    parseExactGrade(metadata?.grade_level) ??
    parseExactGrade((metadata?.age ?? 12) - 6) ??
    6;

  // subject fallback (pngs you already ship in the same bucket root)
  const fallbackUrl = useMemo(() => {
    const subjectMap: Record<string, string> = {
      mathematics: 'math.png',
      science: 'science.png',
      geography: 'geography.png',
      'computer-science': 'computer-science.png',
      music: 'music.png',
      'creative-arts': 'arts.png',
      'body-lab': 'pe.png',
      'life-essentials': 'life.png',
      'history-religion': 'history.png',
      languages: 'languages.png',
      'mental-wellness': 'wellness.png',
      default: 'default.png',
    };
    const key = subject?.toLowerCase() ?? 'default';
    const file = subjectMap[key] ?? subjectMap.default;
    const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;
    return `${base}/${file}`;
  }, [subject]);

  const [src, setSrc] = useState<string>(fallbackUrl);
  const backoffMs = useRef(600); // start small
  const generationQueued = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const recheckForImage = async () => {
      try {
        const path = `${universeId}/${resolvedGrade}/cover.webp`;
        const url = await publicOrSignedUrl(path);
        
        if (!cancelled && url) {
          setSrc(url);
          backoffMs.current = 600; // reset backoff
          return;
        }
        
        // File missing: gentle backoff recheck (never retry on auth errors)
        if (url === null) {
          const delay = Math.min(backoffMs.current, 8000);
          timer = setTimeout(recheckForImage, delay);
          backoffMs.current *= 2; // cap at ~8s
        }
      } catch (error) {
        // Stop retrying on actual errors (401/403/5xx) - these won't resolve by waiting
        console.warn('Image URL fetch failed:', error);
      }
    };

    // start from fallback
    setSrc(fallbackUrl);
    backoffMs.current = 600; // reset

    // fire-and-forget generation request (one-time guard)
    if (!generationQueued.current) {
      generationQueued.current = true;
      
      supabase.functions
        .invoke('image-ensure', {
          body: {
            universeId,
            universeTitle: title,
            subject: subject || 'educational',
            scene: 'cover: main activity',
            grade: resolvedGrade,
          },
        })
        .then(({ data, error }) => {
          if (cancelled || error) return;
          if (import.meta.env.DEV) console.log('✅ Image generation queued:', data);
        })
        .catch((err) => {
          if (import.meta.env.DEV) console.log('🔄 Generation failed:', err);
        });
    }

    // start checking for the generated image
    recheckForImage();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [universeId, resolvedGrade, fallbackUrl, title, subject]);

  // Reset generation guard when universeId changes
  useEffect(() => {
    generationQueued.current = false;
  }, [universeId, resolvedGrade]);

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
        <div className="absolute top-2 right-2 text-xs">
          <span className="bg-blue-500 text-white px-1 rounded">G{resolvedGrade}</span>
        </div>
      )}
    </div>
  );
}
