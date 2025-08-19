import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UniverseImageProps {
  universeId: string;
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  version?: string; // For cache busting
}

export function UniverseImage({ universeId, title, subject, className = "", alt }: UniverseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");
  
  // Base storage URL - shows immediately for instant feel
  const baseStorageUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images`;
  const placeholderUrl = `${baseStorageUrl}/${universeId}.png`;

  // Smart fallback chain for when image fails to load
  const getFallbackUrls = () => {
    const subjectMap: Record<string, string> = {
      mathematics: "math.png",
      science: "science.png", 
      geography: "geography.png",
      "computer-science": "computer-science.png",
      music: "music.png",
      "creative-arts": "arts.png",
      "body-lab": "pe.png",
      "life-essentials": "life.png",
      "Life Skills": "life.png", // Add mapping for catalog subjects
      "history-religion": "history.png",
      languages: "languages.png",
      "mental-wellness": "wellness.png",
      default: "default.png",
    };

    const subjectImage = subject ? subjectMap[subject] || subjectMap.default : subjectMap.default;
    
    return [
      placeholderUrl,
      `${baseStorageUrl}/${subjectImage}`,
      `${baseStorageUrl}/${subjectMap.default}`
    ];
  };

  // Initialize with placeholder and handle generation
  useEffect(() => {
    // Set placeholder immediately
    setCurrentSrc(placeholderUrl);
    
    if (!universeId) return;
    
    let cancelled = false;

    // Hard client timeout - keep placeholder if function is slow  
    const budget = setTimeout(() => {
      if (!cancelled) {
        console.log('⏰ Function timeout, keeping placeholder');
      }
    }, 2000);

    // Fire-and-forget generation (no blocking)
    supabase.functions.invoke('image-ensure', {
      body: { 
        universeId,
        universeTitle: title,
        subject: subject || 'educational',
        scene: 'cover: main activity',
        grade: 7 // Default grade, could be made configurable
      }
    }).then(({ data, error }) => {
      if (cancelled || error) {
        console.log('🔄 Image generation queued or failed:', error);
        return;
      }
      console.log('✅ Image generation queued:', data);
    }).catch((error) => {
      console.log('🔄 Generation failed:', error);
    }).finally(() => {
      clearTimeout(budget);
    });

    return () => { 
      cancelled = true; 
      clearTimeout(budget); 
    };
  }, [universeId, subject, placeholderUrl]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      const fallbacks = getFallbackUrls();
      setCurrentSrc(fallbacks[1]); // Use subject fallback
      console.log('🔄 Image failed, trying fallback for:', universeId);
    }
  };

  const handleImageLoad = () => {
    setImageError(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <img
        src={currentSrc}
        alt={alt || title}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        decoding="async"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Debug indicators */}
      {import.meta.env.DEV && (
        <div className="absolute top-2 right-2 text-xs flex gap-1">
          {imageError && <span className="bg-orange-500 text-white px-1 rounded">Fallback</span>}
        </div>
      )}
    </div>
  );
}