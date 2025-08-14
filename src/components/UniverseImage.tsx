import { useState } from 'react';

interface UniverseImageProps {
  universeId: string;
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  version?: string; // For cache busting
}

export function UniverseImage({ universeId, title, subject, className = "", alt, version }: UniverseImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Smart fallback chain with responsive images: specific -> subject -> default
  const getImageUrls = (fallbackLevel: number = 0) => {
    const baseUrl = 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images';
    const cacheParam = version ? `?v=${version}` : '';
    
    switch (fallbackLevel) {
      case 0:
        return {
          src: `${baseUrl}/${universeId}.png${cacheParam}`,
          srcSet: `${baseUrl}/${universeId}-512.png${cacheParam} 512w, ${baseUrl}/${universeId}-768.png${cacheParam} 768w, ${baseUrl}/${universeId}.png${cacheParam} 1024w`,
          fallback: `${baseUrl}/${universeId}.png${cacheParam}`
        };
      case 1:
        const subjectImage = subject ? `${subject}.png` : 'default.png';
        return {
          src: `${baseUrl}/${subjectImage}`,
          srcSet: `${baseUrl}/${subjectImage}`,
          fallback: `${baseUrl}/${subjectImage}`
        };
      case 2:
        return {
          src: `${baseUrl}/default.png`,
          srcSet: `${baseUrl}/default.png`,
          fallback: `${baseUrl}/default.png`
        };
      default:
        return {
          src: '/placeholder.svg?height=400&width=600&text=Loading...',
          srcSet: '',
          fallback: '/placeholder.svg?height=400&width=600&text=Loading...'
        };
    }
  };

  const [currentUrls, setCurrentUrls] = useState(getImageUrls(0));
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const handleImageError = () => {
    console.warn(`Image failed to load: ${currentUrls.src}`);
    
    if (fallbackLevel < 3) {
      const nextLevel = fallbackLevel + 1;
      const nextUrls = getImageUrls(nextLevel);
      
      console.log(`Falling back to level ${nextLevel}: ${nextUrls.src}`);
      setFallbackLevel(nextLevel);
      setCurrentUrls(nextUrls);
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
        src={currentUrls.src}
        srcSet={currentUrls.srcSet}
        sizes="(max-width: 640px) 512px, (max-width: 1024px) 768px, 1024px"
        alt={alt || `Learning universe: ${title}`}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
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