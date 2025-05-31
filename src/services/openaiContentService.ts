
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
      console.log('Generating adaptive content with OpenAI:', request);

      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: request
      });

      if (error) {
        console.error('Error calling generate-adaptive-content function:', error);
        throw new Error(`Failed to generate content: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Content generation failed');
      }

      return data.generatedContent;
    } catch (error) {
      console.error('Error in generateAdaptiveContent:', error);
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
      // First, try to get existing content
      const { data: existingContent, error: fetchError } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', difficultyLevel)
        .limit(1);

      if (fetchError) {
        console.error('Error fetching existing content:', fetchError);
      }

      // If we have existing content, use it
      if (existingContent && existingContent.length > 0) {
        console.log('Using existing adaptive content');
        return existingContent[0];
      }

      // If no existing content, generate new content
      console.log('No existing content found, generating new content with AI');
      
      const generatedContent = await this.generateAdaptiveContent({
        subject,
        skillArea,
        difficultyLevel,
        userId
      });

      // Fetch the newly saved content from the database
      const { data: newContent, error: newContentError } = await supabase
        .from('adaptive_content')
        .select('*')
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('difficulty_level', difficultyLevel)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (newContentError) {
        throw new Error('Failed to fetch newly generated content');
      }

      return newContent;
    } catch (error) {
      console.error('Error in getOrGenerateContent:', error);
      throw error;
    }
  }
}

export const openaiContentService = new OpenAIContentService();
