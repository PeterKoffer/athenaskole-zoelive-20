
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting REAL AI generation');
    console.log('📋 Request details:', request);

    try {
      console.log('📞 Calling Supabase edge function: generate-adaptive-content');
      
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('📨 Raw Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Supabase function error: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ No data returned from Supabase function');
        throw new Error('No data returned from Supabase function');
      }

      console.log('📋 Supabase function response data:', data);

      if (data.success === false) {
        console.error('❌ Function returned error response:', data);
        throw new Error(`AI generation failed: ${data.error || 'Unknown error'}`);
      }

      if (!data.success || !data.generatedContent) {
        console.error('❌ Invalid response structure:', data);
        throw new Error('Invalid response from AI generation function');
      }

      const content = data.generatedContent;
      console.log('🎯 Received AI content:', content);

      if (!content.question || !content.options || typeof content.correct !== 'number') {
        console.error('❌ Invalid AI content structure:', content);
        throw new Error('Invalid AI content structure received');
      }

      console.log('✅ AI CONTENT VALIDATION PASSED');
      
      const validatedContent: GeneratedContent = {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30
      };

      console.log('🎉 RETURNING VALIDATED AI CONTENT:', validatedContent);
      return validatedContent;

    } catch (error) {
      console.error('💥 CRITICAL AI GENERATION ERROR:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack,
        request: request
      });
      
      throw new Error(`AI Content Generation Failed: ${error.message}`);
    }
  }
}

export const aiContentGenerator = new AIContentGenerator();
