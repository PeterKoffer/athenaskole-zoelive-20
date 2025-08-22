import { safeInvokeFn } from '@/supabase/functionsClient';

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

interface ImageEnsureResponse {
  status?: string;
  imageUrl?: string;
  cached?: boolean;
  predictionId?: string;
}

export class UniverseImageGeneratorService {
  private static cache = new Map<string, string>();

  async generate(args: { title: string; subject: string; universeId?: string; grade?: number }): Promise<string | null> {
    const { title, subject, universeId, grade } = args;
    const id = universeId || `temp-${Date.now()}`;
    const gradeNum = grade ?? 6;
    try {
      const data = await safeInvokeFn<ImageEnsureResponse>('image-ensure', {
        universeId: id,
        universeTitle: title,
        subject,
        scene: 'cover: main activity',
        grade: gradeNum
      });

      if (data?.status === 'exists' && data?.imageUrl) {
        return data.imageUrl;
      }

      // Use GET instead of HEAD to avoid 400 errors, cache-bust each attempt
      const baseUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${id}/${gradeNum}/cover.webp`;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          const url = `${baseUrl}?v=${Date.now()}`;
          const res = await fetch(url, { method: 'GET', cache: 'no-store' });
          if (res.ok) {
            return url;
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

  // Method for UUID-based image generation with proper fallbacks
  static async getOrCreate(args: { packId: string; title: string; subject: string; grade?: number }): Promise<{ url: string; cached?: boolean } | null> {
    const cacheKey = `img:${args.packId}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { url: cached, cached: true };
    }

    // Check if packId is a UUID - if not, use local fallback
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(args.packId);
    
    if (!isUUID) {
      console.log(`🖼️ Using local fallback for non-UUID: ${args.packId}`);
      return { url: this.getSubjectFallback(args.subject) };
    }

    try {
      const data = await safeInvokeFn<ImageEnsureResponse>('image-ensure', {
        universeId: args.packId,  // UUID only
        universeTitle: args.title,
        subject: args.subject,
        scene: 'cover: main activity',
        grade: args.grade ?? 6
      });

      if (data?.status === 'exists' && data?.imageUrl) {
        this.cache.set(cacheKey, data.imageUrl);
        return {
          url: data.imageUrl,
          cached: data.cached || false
        };
      }

      // Poll with GET instead of HEAD, cache-bust each attempt
      const baseUrl = `https://yphkfkpfdpdmllotpqua.supabase.co/storage/v1/object/public/universe-images/${args.packId}/${args.grade ?? 6}/cover.webp`;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          const url = `${baseUrl}?v=${Date.now()}`;
          const res = await fetch(url, { method: 'GET', cache: 'no-store' });
          if (res.ok) {
            this.cache.set(cacheKey, url);
            return { url };
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 3000));
      }

      console.log(`🖼️ Using subject fallback for ${args.packId}`);
      return { url: this.getSubjectFallback(args.subject) };
    } catch (error) {
      console.error("Failed to generate image:", error);
      return { url: this.getSubjectFallback(args.subject) };
    }
  }

  // Helper to get local subject fallback images
  private static getSubjectFallback(subject: string): string {
    const subjectMap: Record<string, string> = {
      'mathematics': '/fallback-images/math.png',
      'science': '/fallback-images/science.png',
      'geography': '/fallback-images/geography.png',
      'technology': '/fallback-images/computer-science.png',
      'music': '/fallback-images/music.png',
      'creative arts': '/fallback-images/arts.png',
      'physical education': '/fallback-images/pe.png',
      'life skills': '/fallback-images/life.png',
      'history': '/fallback-images/history.png',
      'languages': '/fallback-images/languages.png',
      'mental wellness': '/fallback-images/wellness.png',
      'default': '/fallback-images/default.png'
    };
    const key = subject?.toLowerCase().replace(/[^a-z\s]/g, '');
    return subjectMap[key] || subjectMap.default;
  }

  // Legacy method for backward compatibility
  static async generateImage(request: UniverseImageRequest): Promise<string | null> {
    try {
      console.log('🎨 Generating universe image for:', request);

      const data = await safeInvokeFn<ImageEnsureResponse>('image-ensure', {
        universeId: request.title,
        universeTitle: request.title,
        subject: request.theme || 'education',
        scene: 'cover: main activity'
      });

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