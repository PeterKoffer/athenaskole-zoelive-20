import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type UseUniverseImageOptions = {
  universeId: string;         // required (we write/read by this)
  title: string;
  subject: string;
  scene?: string;             // defaults to "cover: main activity"
  grade?: number;             // optional; we’ll derive from profile if omitted
};

type UseUniverseImageResult = {
  imageUrl: string;
  isLoading: boolean;
  isAI: boolean;
  cached: boolean;
};

// --- helpers ---
function parseExactGrade(v?: string | number): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (v == null) return undefined;
  const m = String(v).match(/\d+/);
  return m ? Number(m[0]) : undefined;
}

export function useUniverseImage(
  { universeId, title, subject, scene = 'cover: main activity', grade }: UseUniverseImageOptions
): UseUniverseImageResult {
  const { user } = useAuth();
  const [imageUrl, setImageUrl]   = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAI, setIsAI]           = useState<boolean>(false);
  const [cached, setCached]       = useState<boolean>(false);

  // Public bucket base (do not rename to baseUrl elsewhere)
  const base = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;

  // Use local/static placeholders while we wait (avoid 400s from missing bucket PNGs)
  const placeholder = '/images/placeholder-16x9.png';

  // Try to fetch the exact path we write (per-grade, webp)
  async function tryGetImage(universe: string, g: number) {
    const finalUrl = `${base}/${universe}/${g}/cover.webp`;
    try {
      const r = await fetch(finalUrl, { method: 'HEAD' });
      if (r.ok) {
        setImageUrl(`${finalUrl}?v=${Date.now()}`);
        setIsAI(true);
        setCached(false);
        setIsLoading(false);
        console.log('✅ AI image ready:', { universe, finalUrl });
        return true;
      }
    } catch {
      // not ready yet
    }
    return false;
  }

  // Poll until available (every 5s, max 2 min)
  function startPolling(universe: string, g: number) {
    const timer = setInterval(async () => {
      if (await tryGetImage(universe, g)) clearInterval(timer);
    }, 5000);
    setTimeout(() => clearInterval(timer), 120000);
  }

  useEffect(() => {
    if (!universeId) return;

    // show a placeholder immediately
    setImageUrl(placeholder);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    // Resolve grade: explicit → profile.grade_level / profile.grade (e.g. "5a") → fallback
    const md = (user?.user_metadata as any) ?? {};
    const profileGrade =
      parseExactGrade(md.grade_level) ??
      parseExactGrade(md.grade) ??
      undefined;

    const resolvedGrade =
      parseExactGrade(grade) ??
      profileGrade ??
      6;

    // Fire & forget: queue/ensure generation
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('image-ensure', {
          body: {
            universeId,
            universeTitle: title,
            subject,
            scene,
            grade: resolvedGrade,
          },
        });

        if (error) {
          console.error('❌ image-ensure error:', error);
          setIsLoading(false);
          return;
        }

        console.log('🎨 image-ensure response:', data);

        // If the function reports an existing image immediately, use it
        if (data?.status === 'exists' && typeof data?.imageUrl === 'string') {
          setImageUrl(`${data.imageUrl}?v=${Date.now()}`);
          setIsAI(true);
          setCached(Boolean(data.cached));
          setIsLoading(false);
          return;
        }

        // Otherwise check once, then poll
        if (!(await tryGetImage(universeId, resolvedGrade))) {
          console.log('⏳ Image queued/not ready yet — polling…');
          startPolling(universeId, resolvedGrade);
        }
      } catch (e) {
        console.error('❌ image-ensure failed:', e);
        setIsLoading(false);
      }
    })();
  }, [universeId, title, subject, scene]);

  return { imageUrl, isLoading, isAI, cached };
}
