import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';

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

  // exact storage path (UUID → grade → cover.webp)
  const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;
  const coverUrl = `${base}/${universeId}/${resolvedGrade}/cover.webp`;

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
    return `${base}/${file}`;
  }, [subject, base]);

  const [src, setSrc] = useState<string>(fallbackUrl);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      attempt += 1;
      try {
        // use GET instead of HEAD — avoids 400-on-missing quirk
        const url = `${coverUrl}?v=${Date.now()}`;
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (!cancelled && res.ok) {
          setSrc(url); // cache-busted direct cover
          return;
        }
      } catch {
        // ignore
      }
      const delay = Math.min(30000, Math.round(800 * Math.pow(1.7, attempt)));
      timer = setTimeout(check, delay);
    };

    // start from fallback
    setSrc(fallbackUrl);
    console.log('🖼️ Using storage fallback for', title);

    // fire-and-forget generation request with debouncing
    const queueKey = `${universeId}-${resolvedGrade}`;
    if (!(window as any).__imageGenerationQueue) {
      (window as any).__imageGenerationQueue = new Set();
    }
    
    if (!(window as any).__imageGenerationQueue.has(queueKey)) {
      (window as any).__imageGenerationQueue.add(queueKey);
      
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
          if (cancelled || error) {
            console.log('🔄 Image generation queued or failed:', error);
            return;
          }
          console.log('✅ Image generation queued:', data);
        })
        .catch((err) => console.log('🔄 Generation failed:', err))
        .finally(() => {
          // Remove from queue after 15 seconds
          setTimeout(() => {
            (window as any).__imageGenerationQueue?.delete(queueKey);
          }, 15000);
        });
    }

    // start polling immediately
    check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [coverUrl, fallbackUrl, universeId, title, subject, resolvedGrade]);

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
