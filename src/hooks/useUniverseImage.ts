import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL } from '@/integrations/supabase/client';

interface UseUniverseImageOptions {
  universeId?: string;
  prompt?: string;
  lang?: string;
}

interface UseUniverseImageResult {
  imageUrl: string;
  isLoading: boolean;
  isAI: boolean;
  cached: boolean;
}

export function useUniverseImage({ universeId, prompt, lang = 'en' }: UseUniverseImageOptions): UseUniverseImageResult {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [cached, setCached] = useState(false);

  // Generate fallback URL
  const fallbackUrl = universeId 
    ? `${SUPABASE_URL}/storage/v1/object/public/universe-images/${universeId}.png`
    : `${SUPABASE_URL}/storage/v1/object/public/universe-images/default.png`;

  useEffect(() => {
    if (!prompt) return;

    // Set fallback immediately
    setImageUrl(fallbackUrl);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    // Generate or fetch AI image in background
    const generateImage = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-universe-image', {
          body: { 
            prompt, 
            universeId, 
            lang 
          }
        });

        if (error) {
          console.error('❌ Universe image generation error:', error);
          return;
        }

        if (data?.success && data?.imageUrl) {
          setImageUrl(data.imageUrl);
          setIsAI(data.isAI || false);
          setCached(data.cached || false);
          console.log('✅ Universe image updated:', { 
            universeId, 
            isAI: data.isAI, 
            cached: data.cached 
          });
        }
      } catch (error) {
        console.error('❌ Universe image generation failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [prompt, universeId, lang, fallbackUrl]);

  return {
    imageUrl,
    isLoading,
    isAI,
    cached
  };
}