import { useEffect, useRef, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from "@/utils/storageUrls";
import { coverKey } from "@/utils/coverKey";
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth';

interface UniverseImageProps {
  universeId: string;              // MUST be the UUID
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  grade?: number;                  // optional hard lock
  canEnsure?: boolean;             // allow image generation for specific roles
}

function parseExactGrade(g?: string | number) {
  const n = Number(String(g ?? '').match(/\d+/)?.[0]);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(12, Math.max(1, n));
}

// Get fallback image path based on subject
function getLocalFallback(subject?: string): string {
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
}

async function ensureImage(universeId: string, title: string, subject?: string, grade?: number): Promise<boolean> {
  try {
    // Ensure we pass the user's JWT; without it you'll get 401/403.
    const { data: s } = await supabase.auth.getSession();
    const accessToken = s?.session?.access_token;

    const { data, error } = await supabase.functions.invoke("image-ensure", {
      body: { 
        universeId,
        universeTitle: title,
        subject: subject || 'educational',
        scene: 'cover: main activity',
        grade: grade || 6
      },
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    if (error) {
      // 403/401 → don't retry again from the client
      console.debug("[image-ensure] skipped/forbidden:", error);
      return false;
    }

    // Check for successful response
    return !!data;
  } catch (e) {
    console.debug("[image-ensure] error:", e);
    return false;
  }
}

export function UniverseImage({
  universeId,
  title,
  subject,
  className = '',
  alt,
  grade,
  canEnsure = false,
}: UniverseImageProps) {
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;

  // single-grade resolution (prefers explicit prop)
  const resolvedGrade =
    grade ??
    parseExactGrade(metadata?.grade_level) ??
    parseExactGrade((metadata?.age ?? 12) - 6) ??
    6;

  const [src, setSrc] = useState<string | null>(null);
  const triedEnsure = useRef(false);
  const unmounted = useRef(false);

  useEffect(() => {
    unmounted.current = false;
    setSrc(null);
    triedEnsure.current = false;

    (async () => {
      const path = coverKey(universeId, resolvedGrade);
      if (!path) {
        setSrc(null);
        return;
      }

      // Try to resolve exactly once
      const url = await resolveImageUrl(path);
      if (unmounted.current) return;

      if (url) {
        setSrc(url);
        return;
      }

      // If we got here, it's a hard miss (400/404). Optionally try server-side ensure ONCE.
      if (canEnsure && !triedEnsure.current) {
        triedEnsure.current = true;
        const ok = await ensureImage(universeId, title, subject, resolvedGrade);
        if (!unmounted.current && ok) {
          // Re-resolve a single time after ensure
          const ensuredUrl = await resolveImageUrl(path);
          if (!unmounted.current) setSrc(ensuredUrl ?? null);
        }
      }
    })();

    return () => {
      unmounted.current = true;
    };
  }, [universeId, resolvedGrade, canEnsure, title, subject]);

  const fallbackImage = getLocalFallback(subject);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src ?? fallbackImage}
        alt={alt || title}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
        onError={() => setSrc(null)} // swap to fallback without loops
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
