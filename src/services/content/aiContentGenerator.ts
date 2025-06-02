
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 Generating adaptive content:', request);

    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('🔄 Supabase function response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        // Return fallback content instead of throwing
        return this.createFallbackContent(request);
      }

      if (!data || !data.success) {
        console.error('❌ Function returned unsuccessful result:', data);
        return this.createFallbackContent(request);
      }

      console.log('✅ Generated content received:', data.generatedContent);
      return data.generatedContent;
    } catch (error) {
      console.error('❌ Error calling generate-adaptive-content:', error);
      return this.createFallbackContent(request);
    }
  }

  private createFallbackContent(request: GenerateContentRequest): GeneratedContent {
    const { subject, skillArea, difficultyLevel } = request;
    
    return {
      question: `What is a key concept in ${skillArea} for ${subject}? (Level ${difficultyLevel})`,
      options: [
        `Fundamental ${skillArea} principle`,
        `Advanced ${skillArea} theory`,
        `Practical ${skillArea} application`,
        `Complex ${skillArea} framework`
      ],
      correct: 0,
      explanation: `This is a sample question about ${skillArea} in ${subject}. Understanding fundamental principles is essential for building knowledge.`,
      learningObjectives: [`Understanding ${skillArea} concepts in ${subject}`],
      estimatedTime: 30
    };
  }
}

export const aiContentGenerator = new AIContentGenerator();
