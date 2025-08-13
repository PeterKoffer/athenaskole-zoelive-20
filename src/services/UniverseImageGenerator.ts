import { supabase } from '@/integrations/supabase/client';

export interface UniverseImageRequest {
  title: string;
  description?: string;
  theme?: string;
}

export interface UniverseImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

export class UniverseImageGenerator {
  static async generateImage(request: UniverseImageRequest): Promise<string | null> {
    try {
      console.log('🎨 Generating universe image for:', request);

      const { data, error } = await supabase.functions.invoke('generate-universe-image', {
        body: request
      });

      if (error) {
        console.error('❌ Universe image generation error:', error);
        return null;
      }

      if (!data?.success || !data?.imageUrl) {
        console.error('❌ Invalid response from image generation:', data);
        return null;
      }

      console.log('✅ Universe image generated successfully:', data.imageUrl);
      return data.imageUrl;

    } catch (error) {
      console.error('❌ Universe image generation failed:', error);
      return null;
    }
  }
}

export const universeImageGenerator = new UniverseImageGenerator();