
import { aiContentGenerator } from './content/aiContentGenerator';
import { contentRepository } from './content/contentRepository';
import { fallbackContentService } from './content/fallbackContentService';
import { GenerateContentRequest, GeneratedContent } from './types/contentTypes';

export class DeepSeekContentService {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    return aiContentGenerator.generateAdaptiveContent(request);
  }

  async getOrGenerateContent(
    subject: string, 
    skillArea: string, 
    difficultyLevel: number, 
    userId: string
  ): Promise<any> {
    try {
      // First, try to get existing content
      const existingContent = await contentRepository.getExistingContent(subject, skillArea, difficultyLevel);

      // If we have existing content, use it
      if (existingContent) {
        console.log('♻️ Using existing adaptive content');
        return existingContent;
      }

      // If no existing content, generate new content with DeepSeek
      console.log('🆕 No existing content found, generating new content with DeepSeek AI');
      
      try {
        const generatedContent = await this.generateAdaptiveContent({
          subject,
          skillArea,
          difficultyLevel,
          userId
        });

        // Try to save the generated content to database
        return await contentRepository.saveGeneratedContent(subject, skillArea, difficultyLevel, generatedContent);

      } catch (aiError) {
        console.error('❌ DeepSeek AI generation failed, using fallback content:', aiError);
        
        // Create fallback content when AI generation fails
        const fallbackContent = fallbackContentService.createFallbackContent(subject, skillArea, difficultyLevel);
        
        // Try to save fallback content
        return await contentRepository.saveFallbackContent(fallbackContent);
      }

    } catch (error) {
      console.error('❌ Error in getOrGenerateContent:', error);
      
      // Final fallback - return basic content structure
      return fallbackContentService.createFallbackContent(subject, skillArea, difficultyLevel);
    }
  }
}

export const deepSeekContentService = new DeepSeekContentService();

// Export aliases for backward compatibility
export const openaiContentService = deepSeekContentService;

// Re-export types for backward compatibility
export type { GenerateContentRequest, GeneratedContent } from './types/contentTypes';
