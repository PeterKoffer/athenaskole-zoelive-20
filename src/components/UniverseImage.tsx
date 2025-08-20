import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { resolveLearnerGrade } from '@/lib/grade';
import { UserMetadata } from '@/types/auth';

interface UniverseImageProps {
  universeId: string;
  title: string;
  subject?: string;
  className?: string;
  alt?: string;
  grade?: number;
}

export function UniverseImage({ universeId, title, subject, className = "", alt, grade }: UniverseImageProps) {
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  // Properly resolve grade from user profile, parsing "5a" → 5
  const resolvedGrade = resolveLearnerGrade(
    metadata?.grade_level, 
    metadata?.age
  ) ?? 6;
  const baseStorageUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images`;
  const expectedPath = `${universeId}/${resolvedGrade}/cover.webp`;
  const publicUrl = `${baseStorageUrl}/${expectedPath}`;
  
  const fallbackUrl = useMemo(() => {
    const subjectMap: Record<string, string> = {
      mathematics: "math.png",
      science: "science.png", 
      geography: "geography.png",
      "computer-science": "computer-science.png",
      music: "music.png",
      "creative-arts": "arts.png",
      "body-lab": "pe.png",
      "life-essentials": "life.png",
      "Life Skills": "life.png",
      "history-religion": "history.png",
      languages: "languages.png",
      "mental-wellness": "wellness.png",
      default: "default.png",
    };
    
    const subjectImage = subject ? subjectMap[subject] || subjectMap.default : subjectMap.default;
    return `${baseStorageUrl}/${subjectImage}`;
  }, [subject, baseStorageUrl]);

  const [src, setSrc] = useState<string>(fallbackUrl);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      attempt += 1;
      try {
        const res = await fetch(publicUrl, { method: 'HEAD', cache: 'no-store' });
        if (res.ok && !cancelled) {
          setSrc(`${publicUrl}?v=${Date.now()}`); // cache-buster
          return;
        }
      } catch {}
      // backoff up to 30s
      const delay = Math.min(30000, Math.round(800 * Math.pow(1.7, attempt)));
      timer = setTimeout(check, delay);
    };

    // Start with fallback and queue generation
    setSrc(fallbackUrl);
    
    // Fire-and-forget generation with learner's grade
    supabase.functions.invoke('image-ensure', {
      body: { 
        universeId,
        universeTitle: title,
        subject: subject || 'educational',
        scene: 'cover: main activity',
        grade: resolvedGrade
      }
    }).then(({ data, error }) => {
      if (cancelled || error) {
        console.log('🔄 Image generation queued or failed:', error);
        return;
      }
      console.log('✅ Image generation queued:', data);
    }).catch((error) => {
      console.log('🔄 Generation failed:', error);
    });

    // Start polling immediately
    check();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [publicUrl, fallbackUrl, universeId, title, subject, grade]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt || title}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        decoding="async"
        onError={() => setSrc(fallbackUrl)}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Debug indicators */}
      {import.meta.env.DEV && (
        <div className="absolute top-2 right-2 text-xs flex gap-1">
          <span className="bg-blue-500 text-white px-1 rounded text-xs">G{resolvedGrade}</span>
        </div>
      )}
    </div>
  );
}