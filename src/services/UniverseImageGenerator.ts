import { getUniverseImageSignedUrl } from '@/services/universeImages';

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
    const { universeId, grade } = args;
    const id = universeId || `temp-${Date.now()}`;
    const gradeNum = grade ?? 6;
    
    try {
      const path = `${id}/${gradeNum}/cover.webp`;
      const url = await getUniverseImageSignedUrl(path);
      return url;
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
      const path = `${args.packId}/${args.grade ?? 6}/cover.webp`;
      const url = await getUniverseImageSignedUrl(path);
      this.cache.set(cacheKey, url);
      return { url };
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
      
      const path = `${request.title}/6/cover.webp`;
      const url = await getUniverseImageSignedUrl(path);
      return url;
    } catch (error) {
      console.error('❌ Universe image generation failed:', error);
      return null;
    }
  }
}

export const UniverseImageGenerator = new UniverseImageGeneratorService();