import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';
import { coverUrl } from '@/utils/storageUrls';

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

  // Local fallback helper
  const getLocalFallback = useMemo(() => {
    const subjectMap: Record<string, string> = {
      mathematics: '/images/fallbacks/math.png',
      science: '/images/fallbacks/science.png',
      geography: '/images/fallbacks/geography.png',
      'computer-science': '/images/fallbacks/computer-science.png',
      music: '/images/fallbacks/music.png',
      'creative-arts': '/images/fallbacks/arts.png',
      'body-lab': '/images/fallbacks/pe.png',
      'life-essentials': '/images/fallbacks/life.png',
      'history-religion': '/images/fallbacks/history.png',
      languages: '/images/fallbacks/languages.png',
      'mental-wellness': '/images/fallbacks/wellness.png',
      default: '/images/fallbacks/default.png',
    };
    const key = subject?.toLowerCase() ?? 'default';
    return subjectMap[key] ?? subjectMap.default;
  }, [subject]);

  const fallbackUrl = getLocalFallback;

  const [src, setSrc] = useState<string>(fallbackUrl);
  const backoffMs = useRef(600); 
  const triedEnsure = useRef(false);
  const hardFail = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const resolveCover = async () => {
      if (hardFail.current || cancelled) return;

      try {
        const url = await coverUrl(universeId, resolvedGrade);
        
        if (cancelled) return;

        if (url) {
          setSrc(url);
          backoffMs.current = 600; // reset backoff
          return;
        }

        // Missing: ask backend to generate/upload only once
        if (!triedEnsure.current) {
          triedEnsure.current = true;
          try {
            const { error } = await supabase.functions.invoke('image-ensure', {
              body: {
                universeId,
                universeTitle: title,
                subject: subject || 'educational',
                scene: 'cover: main activity',
                grade: resolvedGrade,
              },
            });
            if (error) throw error;
            if (import.meta.env.DEV) console.log('✅ Image generation queued');
          } catch (err) {
            hardFail.current = true;
            setSrc(getLocalFallback);
            if (import.meta.env.DEV) console.debug('[image-ensure] failed:', err);
            return;
          }
        }

        // Recheck later (cap at 8s). Only for "missing" case.
        if (!cancelled) {
          const delay = Math.min(backoffMs.current, 8000);
          timer = setTimeout(resolveCover, delay);
          backoffMs.current *= 2;
        }
      } catch (error) {
        if (cancelled) return;
        console.warn('Image resolution failed:', error);
        hardFail.current = true;
        setSrc(getLocalFallback);
      }
    };

    // Start from fallback
    setSrc(fallbackUrl);
    backoffMs.current = 600;
    
    // Begin resolution
    resolveCover();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [universeId, resolvedGrade, fallbackUrl, title, subject, getLocalFallback]);

  // Reset guards when universeId changes
  useEffect(() => {
    triedEnsure.current = false;
    hardFail.current = false;
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
