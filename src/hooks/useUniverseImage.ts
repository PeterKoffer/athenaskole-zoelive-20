import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { learnerGrade } from '@/lib/gradeLabels';
import { UserMetadata } from '@/types/auth';

interface UseUniverseImageOptions {
  universeId?: string;
  title: string;
  subject: string;
  scene?: string;
}

interface UseUniverseImageResult {
  imageUrl: string;
  isLoading: boolean;
  isAI: boolean;
  cached: boolean;
}

// Subject mapping for better fallbacks
const SUBJECT_MAP: Record<string, string> = {
  mathematics: "math.png",
  science: "science.png", 
  geography: "geography.png",
  "computer-science": "computer-science.png",
  music: "music.png",
  "creative-arts": "arts.png",
  "body-lab": "pe.png",
  "life-essentials": "life.png",
  "history-religion": "history.png",
  languages: "languages.png",
  "mental-wellness": "wellness.png",
  default: "default.png",
};

export function useUniverseImage({ universeId, title, subject, scene = 'cover: main activity' }: UseUniverseImageOptions): UseUniverseImageResult {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [cached, setCached] = useState(false);

  // Get the key to use (universe ID or slug) - with guard
  const key = universeId;
  const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';

  // Smart fallback chain: specific -> subject -> local fallback -> default
  const getFallbackUrl = (): string => {
    if (!key) return `/fallback-images/default.png`;
    
    // Try: exact universe match -> subject category -> local fallback -> default
    const candidates = [
      `${baseUrl}/${key}.png`,
      subject ? `${baseUrl}/${SUBJECT_MAP[subject]}` : null,
      `/fallback-images/${key}.png`,
      `/fallback-images/default.png`
    ].filter(Boolean) as string[];
    
    return candidates[0];
  };

  useEffect(() => {
    // Critical guard: wait until we have a valid key
    const key = universeId;
    if (!key) {
      console.log('🔄 useUniverseImage: waiting for universeId...', { universeId });
      return;
    }

    console.log('🖼️ useUniverseImage: starting for', { key, title, subject });

    // 1) Set placeholder immediately (key -> subject -> default)
    const fallbackUrl = getFallbackUrl();
    setImageUrl(fallbackUrl);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    const ensureImage = async () => {
      try {
        const grade = learnerGrade({
          grade_level: (user?.user_metadata as UserMetadata)?.grade_level,
          age: (user?.user_metadata as UserMetadata)?.age
        });
        const { data, error } = await supabase.functions.invoke('image-ensure', {
          body: {
            universeId: key,
            universeTitle: title,
            subject,
            scene,
            grade
          }
        });

        if (error) {
          console.error('❌ Image ensure error:', error);
          return;
        }

        console.log('🎨 Image ensure response:', data);

        if (data?.status === 'exists' && data?.imageUrl) {
          const imageUrlWithVersion = `${data.imageUrl}?v=${Date.now()}`;
          setImageUrl(imageUrlWithVersion);
          setIsAI(true);
          setCached(data.cached || true);
          console.log('✅ Existing image found:', {
            universeId: key,
            url: imageUrlWithVersion,
            cached: data.cached
          });
        } else if (data?.status === 'queued') {
          console.log('⏳ Image generation queued, showing fallback');
          startPolling(key, grade);
        }
      } catch (error) {
        console.error('❌ Image ensure failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 3) Poll for completed images (simplified for existing schema)
    const startPolling = (universeId: string, grade?: number) => {
      const pollInterval = setInterval(async () => {
        try {
          const testUrl = `${baseUrl}/${universeId}/${grade ?? learnerGrade({ grade_level: (user?.user_metadata as UserMetadata)?.grade_level, age: (user?.user_metadata as UserMetadata)?.age })}/cover.webp`;
          const response = await fetch(testUrl, { method: 'HEAD' });
          
          if (response.ok) {
            clearInterval(pollInterval);
            const imageUrlWithVersion = `${testUrl}?v=${Date.now()}`;
            setImageUrl(imageUrlWithVersion);
            setIsAI(true);
            setCached(false);
            console.log('✅ AI image ready:', { 
              universeId: key, 
              url: imageUrlWithVersion 
            });
          }
        } catch (error) {
          // Still polling, image not ready yet
        }
      }, 5000); // Poll every 5 seconds

      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(pollInterval), 120000);
    };

    ensureImage();
  }, [key, title, subject, scene]);

  return {
    imageUrl,
    isLoading,
    isAI,
    cached
  };
}