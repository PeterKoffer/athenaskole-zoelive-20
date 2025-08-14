import { useState } from 'react';

interface UniverseImageProps {
  universeId: string;
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
}

export function UniverseImage({ universeId, title, subject, className = "", alt }: UniverseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Smart fallback chain: specific -> subject -> default
  const getImageUrl = (fallbackLevel: number = 0): string => {
    const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';
    
    switch (fallbackLevel) {
      case 0:
        return `${baseUrl}/${universeId}.png?v=${Date.now()}`; // Cache-busting on first load
      case 1:
        return subject ? `${baseUrl}/${subject}.png` : `${baseUrl}/default.png`;
      case 2:
        return `${baseUrl}/default.png`;
      default:
        return '/placeholder.svg?height=400&width=600&text=Loading...';
    }
  };

  const [currentUrl, setCurrentUrl] = useState(getImageUrl(0));
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const handleImageError = () => {
    console.warn(`Image failed to load: ${currentUrl}`);
    
    if (fallbackLevel < 3) {
      const nextLevel = fallbackLevel + 1;
      const nextUrl = getImageUrl(nextLevel);
      
      console.log(`Falling back to level ${nextLevel}: ${nextUrl}`);
      setFallbackLevel(nextLevel);
      setCurrentUrl(nextUrl);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-center p-4 ${className}`}>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm opacity-75">Learning Universe</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={currentUrl}
        alt={alt || `Learning universe: ${title}`}
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ borderRadius: 'inherit' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm">Loading universe...</div>
          </div>
        </div>
      )}
      
      {fallbackLevel > 0 && !isLoading && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Fallback
        </div>
      )}
    </div>
  );
}