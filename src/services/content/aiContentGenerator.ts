
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting generation with request:', request);

    try {
      console.log('📞 Calling Supabase function generate-adaptive-content...');
      
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('📨 Supabase function raw response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Supabase function error: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ No data returned from function');
        throw new Error('No data returned from Supabase function');
      }

      console.log('📋 Function response data:', data);

      // Check if the function returned an error response
      if (data.success === false) {
        console.error('❌ Function returned error:', data);
        throw new Error(`AI generation failed: ${data.error || 'Unknown error'} | Debug: ${JSON.stringify(data.debug)}`);
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
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        request: request
      });
      
      // Re-throw the error with more context
      throw new Error(`AI Content Generation Failed: ${error.message}`);
    }
  }
}

export const aiContentGenerator = new AIContentGenerator();
