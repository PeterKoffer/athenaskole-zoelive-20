import { useState } from 'react';
import { useUniverseImage } from '@/hooks/useUniverseImage';

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
  
  // Use the hook that properly handles image generation
  const { imageUrl, isLoading, isAI, cached } = useUniverseImage({
    universeId,
    subject,
    lang: 'en'
  });

  // Smart fallback chain for when image fails to load
  const getFallbackUrls = () => {
    const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';
    
    // Subject mapping for better fallbacks
    const subjectMap: Record<string, string> = {
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

    const subjectImage = subject ? subjectMap[subject] || subjectMap.default : subjectMap.default;
    
    return [
      `${baseUrl}/${universeId}.png`,
      `${baseUrl}/${subjectImage}`,
      `${baseUrl}/${subjectMap.default}`
    ];
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      console.log('🔄 Image failed, trying fallback for:', universeId);
    }
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // If loading, show skeleton
  if (isLoading && !imageUrl) {
    return (
      <div className={`${className} bg-neutral-800 animate-pulse flex items-center justify-center`}>
        <div className="text-neutral-600 text-sm">Loading image...</div>
      </div>
    );
  }

  // Use imageUrl from hook, with fallback chain on error
  const currentImageUrl = imageError ? getFallbackUrls()[1] : imageUrl;
  
  return (
    <div className={`relative ${className}`}>
      <img
        src={currentImageUrl}
        alt={alt || title}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Debug indicators */}
      {import.meta.env.DEV && (
        <div className="absolute top-2 right-2 text-xs">
          {isAI && <span className="bg-green-500 text-white px-1 rounded">AI</span>}
          {cached && <span className="bg-blue-500 text-white px-1 rounded ml-1">Cached</span>}
          {imageError && <span className="bg-orange-500 text-white px-1 rounded ml-1">Fallback</span>}
        </div>
      )}
    </div>
  );
}