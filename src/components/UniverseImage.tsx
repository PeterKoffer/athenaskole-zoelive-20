import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { publicOrSignedUrl } from '@/utils/storageUrls';
import { coverKey } from '@/utils/coverKey';
import DefaultImage from '@/assets/fallback-images/default.png';

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

  // subject fallback (local assets to avoid storage dependency)
  const fallbackUrl = useMemo(() => {
    const subjectMap: Record<string, string> = {
      mathematics: '/fallback-images/math.png',
      science: '/fallback-images/science.png',
      geography: '/fallback-images/geography.png',
      'computer-science': '/fallback-images/computer-science.png',
      music: '/fallback-images/music.png',
      'creative-arts': '/fallback-images/arts.png',
      'body-lab': '/fallback-images/pe.png',
      'life-essentials': '/fallback-images/life.png',
      'history-religion': '/fallback-images/history.png',
      languages: '/fallback-images/languages.png',
      'mental-wellness': '/fallback-images/wellness.png',
      default: DefaultImage,
    };
    const key = subject?.toLowerCase() ?? 'default';
    return subjectMap[key] ?? subjectMap.default;
  }, [subject]);

  const [src, setSrc] = useState<string>(fallbackUrl);
  const backoffMs = useRef(600); // start small
  const generationQueued = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const recheckForImage = async () => {
      try {
        const path = coverKey(universeId, resolvedGrade);
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
          if (!data?.ok && import.meta.env.DEV) {
            console.debug('[image-ensure]', data?.error || 'unknown error');
          }
          if (import.meta.env.DEV) console.log('✅ Image generation queued:', data);
        })
        .catch((err) => {
          if (import.meta.env.DEV) console.debug('[image-ensure]', err);
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
        crossOrigin="anonymous"
        fetchPriority="auto"
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
