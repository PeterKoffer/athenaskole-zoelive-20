
import { supabase } from '@/integrations/supabase/client';

export interface GenerateContentRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

export interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
}

export class OpenAIContentService {
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

  async getOrGenerateContent(
    subject: string, 
    skillArea: string, 
    difficultyLevel: number, 
    userId: string
  ): Promise<any> {
    try {
      console.log(`🔍 Looking for existing content: ${subject}/${skillArea} level ${difficultyLevel}`);
      
      // First, try to get existing content
      const { data: existingContent, error: fetchError } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', difficultyLevel)
        .limit(1);

      if (fetchError) {
        console.error('❌ Error fetching existing content:', fetchError);
      }

      console.log('📋 Existing content found:', existingContent);

      // If we have existing content, use it
      if (existingContent && existingContent.length > 0) {
        console.log('♻️ Using existing adaptive content');
        return existingContent[0];
      }

      // If no existing content, generate new content
      console.log('🆕 No existing content found, generating new content with AI');
      
      const generatedContent = await this.generateAdaptiveContent({
        subject,
        skillArea,
        difficultyLevel,
        userId
      });

      console.log('🔄 Fetching newly saved content from database...');

      // Add a small delay to ensure the content is saved
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the newly saved content from the database
      const { data: newContent, error: newContentError } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', difficultyLevel)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (newContentError) {
        console.error('❌ Failed to fetch newly generated content:', newContentError);
        throw new Error('Failed to fetch newly generated content');
      }

      if (!newContent) {
        console.error('❌ No content found after generation');
        throw new Error('Content was generated but not found in database');
      }

      console.log('✅ Successfully retrieved newly generated content:', newContent);
      return newContent;
    } catch (error) {
      console.error('❌ Error in getOrGenerateContent:', error);
      throw error;
    }
  }
}

export const openaiContentService = new OpenAIContentService();
