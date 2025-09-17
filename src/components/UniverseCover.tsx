import { coverUrl } from '../utils/imageUrl';
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export default function UniverseCover(
  { universeId, grade }: { universeId: string; grade: number | string }
) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      setIsGenerating(true);
      try {
        // Force regenerate the image using our new prompt system
        const { data, error } = await supabase.functions.invoke('image-ensure', {
          body: {
            universeId,
            gradeInt: typeof grade === 'string' ? parseInt(grade, 10) : grade,
            title: universeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            mode: 'pro', // NEVER classroom
            force: true // Force regeneration to clear old classroom images
          }
        });
        
        if (error) throw error;
        if (data?.url) {
          setImageUrl(data.url);
        } else {
          // Fallback to direct URL
          setImageUrl(coverUrl(universeId, grade, String(Date.now())));
        }
      } catch (error) {
        console.error('Failed to generate image:', error);
        // Fallback to direct URL
        setImageUrl(coverUrl(universeId, grade, String(Date.now())));
      } finally {
        setIsGenerating(false);
      }
    };

    generateImage();
  }, [universeId, grade]);

  if (isGenerating) {
    return (
      <div className="w-full aspect-video rounded-xl bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground">Generating new image...</span>
      </div>
    );
  }

  return <img src={imageUrl} alt="Universe cover" className="w-full h-auto rounded-xl" />;
}
