import { useEffect, useState } from "react";
import { invokeFn } from '@/supabase/functionsClient';
import { useAuth } from '@/hooks/useAuth';
import { resolveImageUrl } from "@/utils/storageUrls";
import { coverKey } from "@/utils/coverKey";
import { UserMetadata } from '@/types/auth';

interface UniverseImageProps {
  universeId: string;              // MUST be the UUID
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  grade?: number;                  // optional hard lock
  canEnsure?: boolean;             // allow image generation for specific roles
}

function parseExactGrade(g?: string | number) {
  const n = Number(String(g ?? '').match(/\d+/)?.[0]);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(12, Math.max(1, n));
}

// Get fallback image path based on subject
function getLocalFallback(subject?: string): string {
  const subjectMap: Record<string, string> = {
    mathematics: '/images/fallbacks/math.png',
    science: '/images/fallbacks/science.png',
    geography: '/images/fallbacks/geography.png',
    'computer-science': '/images/fallbacks/computer-science.png',
    music: '/images/fallbacks/music.png',
    'creative-arts': '/images/fallbacks/arts.png',
    'body-lab': '/images/fallbacks/pe.png',
    'life-essentials': '/images/fallbacks/life.png',
    'history-religion': '/images/fallbacks/history.png',
    languages: '/images/fallbacks/languages.png',
    'mental-wellness': '/images/fallbacks/wellness.png',
    default: '/images/fallbacks/default.png',
  };
  const key = subject?.toLowerCase() ?? 'default';
  return subjectMap[key] ?? subjectMap.default;
}

const ensureImage = async (
  universeId: string,
  title: string,
  subject?: string,
  grade?: number
): Promise<{ imageUrl?: string; status?: string }> => {
  try {
    const data = await invokeFn("image-ensure", {
      universeId,
      universeTitle: title,
      subject: subject || 'education',
      scene: 'cover: main activity',
      grade: grade || 6
    });

    return data || {};
  } catch (error) {
    console.error('Error ensuring image:', error);
    throw error;
  }
};

export const UniverseImage: React.FC<UniverseImageProps> = ({ 
  universeId, 
  title, 
  subject, 
  className = "", 
  alt,
  grade,
  canEnsure = false 
}) => {
  const { user, loading: authLoading } = useAuth();

  const metadata = user?.user_metadata as UserMetadata | undefined;
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageFound, setImageFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // single-grade resolution (prefers explicit prop)
  const resolvedGrade =
    grade ??
    parseExactGrade(metadata?.grade_level) ??
    parseExactGrade((metadata?.age ?? 12) - 6) ??
    6;

  const fallbackSrc = getLocalFallback(subject);

  useEffect(() => {
    const loadImage = async () => {
      if (!universeId || !title) {
        setImageSrc(fallbackSrc);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // First try to resolve existing image
      const path = coverKey(universeId, resolvedGrade);
      if (path) {
        const url = await resolveImageUrl(path);
        if (url) {
          setImageSrc(url);
          setImageFound(true);
          setLoading(false);
          return;
        }
      }

      // Try to ensure/generate the image if allowed and user is authenticated
      if (canEnsure && !authLoading && user) {
        try {
          console.log('🎨 Attempting to ensure image for:', universeId, title);
          const result = await ensureImage(universeId, title, subject, resolvedGrade);
          
          if (result.imageUrl) {
            setImageSrc(result.imageUrl);
            setImageFound(true);
            console.log('✅ Image ensured:', result.imageUrl);
          } else {
            console.log('⏳ Image generation queued, using fallback');
            setImageSrc(fallbackSrc);
          }
        } catch (error) {
          console.error('❌ Failed to ensure image:', error);
          setImageSrc(fallbackSrc);
        }
      } else {
        setImageSrc(fallbackSrc);
      }
      
      setLoading(false);
    };

    loadImage();
  }, [universeId, title, subject, resolvedGrade, canEnsure, fallbackSrc, authLoading, user]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}
      {!loading && (
        <img
          src={imageSrc}
          alt={alt || title}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          onError={() => {
            if (imageSrc !== fallbackSrc) {
              setImageSrc(fallbackSrc);
              setImageFound(false);
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      )}
      {import.meta.env.DEV && (
        <div className="absolute top-2 right-2 text-xs">
          <span className="bg-blue-500 text-white px-1 rounded">G{resolvedGrade}</span>
          {imageFound && <span className="bg-green-500 text-white px-1 rounded ml-1">AI</span>}
        </div>
      )}
    </div>
  );
};
