import { useState, useEffect } from 'react';

interface UseUniverseImageOptions {
  universeId?: string;
  prompt?: string;
  lang?: string;
  subject?: string;
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

export function useUniverseImage({ universeId, prompt, lang = 'en', subject }: UseUniverseImageOptions): UseUniverseImageResult {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [cached, setCached] = useState(false);

  // Get the key to use (universe ID or slug) - with guard
  const key = universeId;
  const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';

  // Smart fallback chain: specific -> subject -> default
  const getFallbackUrl = (): string => {
    if (!key) return `${baseUrl}/${SUBJECT_MAP.default}`;
    
    // Try: exact universe match -> subject category -> default
    const candidates = [
      `${baseUrl}/${key}.png`,
      subject ? `${baseUrl}/${SUBJECT_MAP[subject]}` : null,
      `${baseUrl}/${SUBJECT_MAP.default}`
    ].filter(Boolean) as string[];
    
    return candidates[0];
  };

  useEffect(() => {
    // Critical guard: wait until we have a valid key
    if (!key) {
      console.log('🔄 useUniverseImage: waiting for universeId...', { universeId });
      return;
    }

    console.log('🖼️ useUniverseImage: starting for', { key, subject, hasPrompt: !!prompt });

    // 1) Set placeholder immediately (key -> subject -> default)
    const fallbackUrl = getFallbackUrl();
    setImageUrl(fallbackUrl);
    setIsLoading(true);
    setIsAI(false);
    setCached(false);

    // 2) Generate or fetch AI image in background using absolute URL
    const generateImage = async () => {
      try {
        // Use absolute URL to avoid SSR/proxy/origin issues
        const response = await fetch(`https://yphkfkpfdpdmllotpqua.supabase.co/functions/v1/generate-universe-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            imagePrompt: prompt, 
            universeId: key, 
            lang,
            subject
          })
        });
        
        const data = await response.json();

        if (!response.ok) {
          console.error('❌ Universe image generation error:', response.status, data);
          return;
        }

        if (data?.success && data?.imageUrl) {
          // Cache-bust on first AI swap to ensure fresh image shows
          const imageUrlWithVersion = data.from === 'ai' && !data.cached 
            ? `${data.imageUrl}?v=${Date.now()}`
            : data.imageUrl;
            
          setImageUrl(imageUrlWithVersion);
          setIsAI(data.isAI || false);
          setCached(data.cached || false);
          console.log('✅ Universe image updated:', { 
            universeId: key, 
            from: data.from,
            isAI: data.isAI, 
            cached: data.cached 
          });
        }
      } catch (error) {
        console.error('❌ Universe image generation failed:', error);
        // Keep the placeholder fallback
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, [key, prompt, lang, subject]);

  return {
    imageUrl,
    isLoading,
    isAI,
    cached
  };
}