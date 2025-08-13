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

export class UniverseImageGeneratorService {
  private static cache = new Map<string, string>();

  async generate(prompt: string): Promise<string | null> {
    try {
      console.log('🎨 Generating universe image with prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-universe-image', {
        body: { prompt }
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

  // New method for pack-based image generation with caching
  static async getOrCreate(args: { prompt: string; packId?: string }): Promise<{ url: string; cached?: boolean } | null> {
    const cacheKey = `img:${args.packId || args.prompt}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { url: cached, cached: true };
    }

    try {
      const instance = new UniverseImageGeneratorService();
      const url = await instance.generate(args.prompt);
      
      if (url) {
        this.cache.set(cacheKey, url);
        return { url, cached: false };
      }
      
      return null;
    } catch (error) {
      console.error("Failed to generate image:", error);
      return null;
    }
  }

  // Legacy method for backward compatibility
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

export const UniverseImageGenerator = new UniverseImageGeneratorService();