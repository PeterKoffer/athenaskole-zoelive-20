import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type UseUniverseImageOptions = {
  universeId?: string;           // optional is OK
  title: string;
  subject: string;
  scene?: string;
};

type UseUniverseImageResult = {
  imageUrl: string;
  isLoading: boolean;
  isAI: boolean;
  cached: boolean;
};

// Subject mapping for better fallbacks
const SUBJECT_MAP: Record<string, string> = {
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

export function useUniverseImage(
  { universeId, title, subject, scene = 'cover: main activity' }: UseUniverseImageOptions
): UseUniverseImageResult {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [cached, setCached] = useState(false);

  // Storage base URL (PUBLIC bucket)
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;

  // Smart fallback chain: specific -> subject -> local fallback -> default
  const getFallbackUrl = (): string => {
    if (!universeId) return '/fallback-images/default.png';

    const candidates = [
      `${baseUrl}/${universeId}.png`,                   // legacy single-file fallback
      subject ? `${baseUrl}/${SUBJECT_MAP[subject]}` : null,
      `/fallback-images/${universeId}.png`,
      '/fallback-images/default.png',
    ].filter(Boolean) as string[];

    return candidates[0];
  };

  useEffect(() => {
    // guard: we need an id to generate/poll
    if (!universeId) {
      // leave placeholder empty or set a generic fallback
      return;
    }

    // 1) Set placeholder immediately
    const fallbackUrl = getFallbackUrl();
    setImageUrl(fallbackUrl);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    const parseExactGrade = (g?: string | number) =>
      Math.min(12, Math.max(1, Number(String(g ?? '').match(/\d+/)?.[0]) || 7));

    const ensureImage = async () => {
      try {
        const meta = user?.user_metadata as Record<string, unknown> | undefined;
        const fromProfile =
          (meta?.grade_level as string | undefined) ??
          (meta?.grade as string | undefined);

        // Try grade from profile like "5a" → 5, else derive from age, fallback 6
        const grade =
          parseExactGrade(fromProfile) ??
          parseExactGrade(typeof meta?.age === 'number' ? (meta!.age as number) - 6 : undefined) ??
          6;

        // Ask edge function to ensure image exists (or queue it)
        const { data, error } = await supabase.functions.invoke('image-ensure', {
          body: {
            universeId,
            universeTitle: title,
            subject,
            scene,
            grade,
          },
        });

        if (error) {
          console.error('❌ image-ensure error:', error);
          return;
        }

        // If it already exists, use it immediately
        if (data?.status === 'exists' && typeof data?.imageUrl === 'string') {
          const url = `${data.imageUrl}?v=${Date.now()}`;
          setImageUrl(url);
          setIsAI(true);
          setCached(Boolean(data.cached));
          return;
        }

        // Otherwise poll storage at the exact per-grade path
        if (data?.status === 'queued' || data?.status === 'accepted' || !data?.status) {
          startPolling(universeId, grade);
        }
      } catch (e) {
        console.error('❌ image-ensure failed:', e);
      } finally {
        setIsLoading(false);
      }
    };

    const startPolling = (id: string, grade: number) => {
      const interval = setInterval(async () => {
        const testUrl = `${baseUrl}/${id}/${grade}/cover.webp?v=${Date.now()}`;
        try {
          const head = await fetch(testUrl, { method: 'HEAD' });
          if (head.ok) {
            clearInterval(interval);
            setImageUrl(testUrl);
            setIsAI(true);
            setCached(false);
          }
        } catch {
          // keep polling
        }
      }, 5000); // 5s

      // stop after 2 minutes
      setTimeout(() => clearInterval(interval), 120000);
    };

    ensureImage();
  }, [universeId, title, subject, scene]); // re-run if any change

  return { imageUrl, isLoading, isAI, cached };
}
