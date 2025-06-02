
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    try {
      console.log('🤖 Generating adaptive content with OpenAI:', request);

      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      console.log('🔄 Supabase function response:', { data, error });

      if (error) {
        console.error('❌ Error calling generate-adaptive-content function:', error);
        throw new Error(`Failed to generate content: ${error.message}`);
      }

      if (!data || !data.success) {
        console.error('❌ Content generation failed:', data?.error || 'Unknown error');
        throw new Error(data?.error || 'Content generation failed');
      }

      console.log('✅ Generated content received:', data.generatedContent);
      return data.generatedContent;
    } catch (error) {
      console.error('❌ Error in generateAdaptiveContent:', error);
      throw error;
    }
  }
}

export const aiContentGenerator = new AIContentGenerator();
