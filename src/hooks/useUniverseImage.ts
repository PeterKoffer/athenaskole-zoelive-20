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

// helpers
const isUUID = (s?: string) => !!s && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
const parseGrade = (g?: string | number, age?: number) =>
  Math.min(12, Math.max(1, Number(String(g ?? '').match(/\d+/)?.[0]) || (Number.isFinite(age) ? (age as number) - 6 : 7)));

// Subject mapping for better fallbacks - using local fallback images
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

  const BUCKET_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/universe-images`;
  const subjectFallback = `/fallback-images/${SUBJECT_MAP[subject] || SUBJECT_MAP.default}`;

  useEffect(() => {
    if (!isUUID(universeId)) {
      // show local fallback, do not poll Storage for slugs
      setImageUrl(subjectFallback);
      return;
    }

    const meta = user?.user_metadata || {};
    const grade = parseGrade(meta.grade_level ?? meta.grade, meta.age);

    // optimistically show subject fallback while we queue/check
    setImageUrl(subjectFallback);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    const run = async () => {
      try {
        // queue (or short-circuit to "exists")
        const { error } = await supabase.functions.invoke("image-ensure", {
          body: { universeId, universeTitle: title, subject, scene, grade },
        });
        if (error) throw error;

        // poll exact path
        const url = `${BUCKET_BASE}/${encodeURIComponent(universeId!)}/${grade}/cover.webp?v=${Date.now()}`;
        const ok = await fetch(url, { method: "HEAD" }).then(r => r.ok).catch(() => false);
        if (ok) {
          setImageUrl(url);
          setIsAI(true);
          return;
        }

        // keep polling up to 2 minutes
        const start = Date.now();
        const timer = setInterval(async () => {
          const ok = await fetch(url, { method: "HEAD" }).then(r => r.ok).catch(() => false);
          if (ok) {
            clearInterval(timer);
            setImageUrl(url);
            setIsAI(true);
          } else if (Date.now() - start > 120000) {
            clearInterval(timer);
          }
        }, 5000);
      } catch (e) {
        console.error("useUniverseImage error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [universeId, title, subject, scene]);

  return { imageUrl, isLoading, isAI, cached };
}
