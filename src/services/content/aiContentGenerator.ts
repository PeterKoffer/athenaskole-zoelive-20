
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting generation with request:', request);

    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('🔄 Supabase function response received:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Function error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('❌ No data returned from function');
        throw new Error('No data returned from function');
      }

      if (!data.success) {
        console.error('❌ Function returned unsuccessful result:', data);
        throw new Error(`Function failed: ${data.error || 'Unknown error'}`);
      }

      if (!data.generatedContent) {
        console.error('❌ No generated content in response:', data);
        throw new Error('No generated content in response');
      }

      console.log('✅ Generated content validated and received:', data.generatedContent);
      
      // Ensure the content has all required fields
      const content = data.generatedContent;
      if (!content.question || !content.options || typeof content.correct !== 'number') {
        console.error('❌ Invalid content structure:', content);
        throw new Error('Invalid content structure received');
      }

      // Return the validated content - this is successful generation
      return {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30
      };

    } catch (error) {
      console.error('❌ Error in AIContentGenerator:', error);
      // Re-throw the error so the hook can handle it appropriately
      throw error;
    }
  }

  private createFallbackContent(request: GenerateContentRequest): GeneratedContent {
    const { subject, skillArea, difficultyLevel } = request;
    
    console.log('🔄 Creating fallback content for:', { subject, skillArea, difficultyLevel });
    
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
