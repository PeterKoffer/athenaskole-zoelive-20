import React from 'react';
import { useUniverseImage } from '@/hooks/useUniverseImage';

interface UniverseImageProps {
  path?: string;
  universeId?: string;
  title?: string;
  subject?: string;
  alt?: string;
  className?: string;
  label?: string;
}

export const UniverseImage: React.FC<UniverseImageProps> = ({ 
  path, 
  universeId,
  alt = 'Cover', 
  className = '',
  label = 'Cover'
}) => {
  // If universeId is provided, construct the path
  const imagePath = path || (universeId ? `${universeId}/6/cover.webp` : undefined);
  
  const { url, fallback, meta } = useUniverseImage(imagePath, { label });

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => { /* Browser image loader fallback handled by hook */ }}
      />
      {/* valgfri badge ved fallback */}
      {fallback && (
        <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-black/60 text-white">
          Placeholder
        </div>
      )}
      {/* valgfri debug */}
      {process.env.NODE_ENV !== 'production' && meta && (
        <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-black/50 text-white">
          {meta.type} • {meta.len}b
        </div>
      )}
    </div>
  );
};

export default UniverseImage;
