
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting generation with DeepSeek');
    console.log('📋 Request:', request);

    try {
      console.log('📞 Calling edge function: generate-adaptive-content (using DeepSeek)');
      
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('📨 Function response:', { data, error });

      if (error) {
        console.error('❌ Function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No data returned');
        throw new Error('No data returned from function');
      }

      if (!data.success) {
        console.error('❌ Function returned error:', data.error);
        throw new Error(data.error || 'Unknown error');
      }

      if (!data.generatedContent) {
        console.error('❌ No generated content in response');
        throw new Error('No generated content in response');
      }

      const content = data.generatedContent;
      console.log('🎯 Generated content with DeepSeek:', content);

      // Validate structure
      if (!content.question || !Array.isArray(content.options) || typeof content.correct !== 'number') {
        console.error('❌ Invalid content structure:', content);
        throw new Error('Invalid content structure');
      }

      const validatedContent: GeneratedContent = {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30,
        prompt_used: content.prompt_used, // Pass through the prompt_used
        // ai_estimated_difficulty will be undefined if not present in content
        ai_estimated_difficulty: content.ai_estimated_difficulty
      };

      console.log('✅ Returning validated content from DeepSeek:', validatedContent);
      return validatedContent;

    } catch (error: any) {
      console.error('💥 AI generation error with DeepSeek:', error);
      throw new Error(`DeepSeek AI generation failed: ${error.message}`);
    }
  }
}

export const aiContentGenerator = new AIContentGenerator();
