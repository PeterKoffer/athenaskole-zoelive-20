import React from 'react';
import { useUniverseImage } from '@/hooks/useUniverseImage';

interface UniverseImageProps {
  path: string;
  alt?: string;
  className?: string;
  label?: string;
}

export const UniverseImage: React.FC<UniverseImageProps> = ({ 
  path, 
  alt = 'Cover', 
  className = '',
  label = 'Cover'
}) => {
  const { url, loading, fallback, meta } = useUniverseImage(path, { label });

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => { /* Hvis Browser-image loader fejler, så hold fast i inline placeholder */ }}
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
