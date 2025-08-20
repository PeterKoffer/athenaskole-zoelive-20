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

  async generate(args: { title: string; subject: string; universeId?: string; grade?: number }): Promise<string | null> {
    const { title, subject, universeId, grade } = args;
    const id = universeId || `temp-${Date.now()}`;
    const gradeNum = grade ?? 6;
    try {
      const { data, error } = await supabase.functions.invoke('image-ensure', {
        body: {
          universeId: id,
          universeTitle: title,
          subject,
          scene: 'cover: main activity',
          grade: gradeNum

        }
      });

      if (error) {
        console.error('❌ Universe image generation error:', error);
        return null;
      }

      if (data?.status === 'exists' && data?.imageUrl) {
        return data.imageUrl as string;
      }

      const storageUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${id}/${gradeNum}/cover.webp`;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          const res = await fetch(storageUrl, { method: 'HEAD' });
          if (res.ok) {
            return `${storageUrl}?v=${Date.now()}`;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 3000));
      }

      return null;

    } catch (error) {
      console.error('❌ Universe image generation failed:', error);
      return null;
    }
  }

  // New method for pack-based image generation with caching
  static async getOrCreate(args: { packId: string; title: string; subject: string; grade?: number }): Promise<{ url: string; cached?: boolean } | null> {
    const cacheKey = `img:${args.packId}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { url: cached, cached: true };
    }

    try {
      const { data, error } = await supabase.functions.invoke('image-ensure', {

        body: {
          universeId: args.packId,
          universeTitle: args.title,
          subject: args.subject,
          scene: 'cover: main activity',
          grade: args.grade ?? 6

        }
      });

      if (error) {
        console.error('❌ Universe image generation error:', error);
        // Return storage fallback on error
        const fallback = args.packId 
          ? `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${args.packId}.png`
          : 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/default.png';
        return { url: fallback };
      }

      if (data?.status === 'exists' && data?.imageUrl) {
        this.cache.set(cacheKey, data.imageUrl);
        return {
          url: data.imageUrl,
          cached: data.cached || false
        };
      }

      const storageUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${args.packId}/${args.grade ?? 6}/cover.webp`;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          const res = await fetch(storageUrl, { method: 'HEAD' });
          if (res.ok) {
            this.cache.set(cacheKey, storageUrl);
            return { url: `${storageUrl}?v=${Date.now()}` };
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 3000));
      }

      const fallback = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${args.packId}.png`;
      console.log(`🖼️ Using storage fallback for ${args.packId}`);
      return { url: fallback };
    } catch (error) {
      console.error("Failed to generate image:", error);
      const fallback = args.packId 
        ? `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${args.packId}.png`
        : 'https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/default.png';
      return { url: fallback };
    }
  }

  // Legacy method for backward compatibility
  static async generateImage(request: UniverseImageRequest): Promise<string | null> {
    try {
      console.log('🎨 Generating universe image for:', request);

      const { data, error } = await supabase.functions.invoke('image-ensure', {

        body: {
          universeId: request.title,
          universeTitle: request.title,
          subject: request.theme || 'education',
          scene: 'cover: main activity'
        }

      });

      if (error) {
        console.error('❌ Universe image generation error:', error);
        return null;
      }

      if (data?.status === 'exists' && data?.imageUrl) {
        console.log('✅ Universe image generated successfully:', data.imageUrl);
        return data.imageUrl;
      }

      return null;

    } catch (error) {
      console.error('❌ Universe image generation failed:', error);
      return null;
    }
  }
}

export const UniverseImageGenerator = new UniverseImageGeneratorService();