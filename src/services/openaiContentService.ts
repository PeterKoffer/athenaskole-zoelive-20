
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
      
      try {
        const generatedContent = await this.generateAdaptiveContent({
          subject,
          skillArea,
          difficultyLevel,
          userId
        });

        // Try to save the generated content to database
        const { data: savedContent, error: saveError } = await supabase
          .from('adaptive_content')
          .insert({
            subject,
            skill_area: skillArea,
            difficulty_level: difficultyLevel,
            title: generatedContent.question,
            content: generatedContent as any, // Cast to any to handle Json type
            learning_objectives: generatedContent.learningObjectives,
            estimated_time: generatedContent.estimatedTime
          })
          .select()
          .single();

        if (saveError) {
          console.error('❌ Error saving generated content:', saveError);
          // Return the generated content even if save fails
          return {
            subject,
            skill_area: skillArea,
            difficulty_level: difficultyLevel,
            title: generatedContent.question,
            content: generatedContent,
            learning_objectives: generatedContent.learningObjectives,
            estimated_time: generatedContent.estimatedTime
          };
        }

        console.log('✅ Successfully saved and retrieved generated content:', savedContent);
        return savedContent;

      } catch (aiError) {
        console.error('❌ AI generation failed, using fallback content:', aiError);
        
        // Create fallback content when AI generation fails
        const fallbackContent = this.createFallbackContent(subject, skillArea, difficultyLevel);
        
        // Try to save fallback content
        try {
          const { data: savedFallback } = await supabase
            .from('adaptive_content')
            .insert(fallbackContent)
            .select()
            .single();
          
          return savedFallback || fallbackContent;
        } catch (saveError) {
          console.error('❌ Error saving fallback content:', saveError);
          return fallbackContent;
        }
      }

    } catch (error) {
      console.error('❌ Error in getOrGenerateContent:', error);
      
      // Final fallback - return basic content structure
      return this.createFallbackContent(subject, skillArea, difficultyLevel);
    }
  }

  private createFallbackContent(subject: string, skillArea: string, difficultyLevel: number) {
    const fallbackQuestions = {
      matematik: {
        addition: 'What is 15 + 27?',
        subtraction: 'What is 50 - 23?',
        multiplication: 'What is 8 × 7?',
        division: 'What is 48 ÷ 6?'
      },
      dansk: {
        spelling: 'Which word is spelled correctly?',
        grammar: 'Choose the correct sentence structure:',
        reading: 'What is the main idea of this text?',
        writing: 'Which sentence uses proper punctuation?'
      },
      engelsk: {
        vocabulary: 'What does "magnificent" mean?',
        grammar: 'Choose the correct verb tense:',
        reading: 'What is the author\'s purpose?',
        speaking: 'How do you pronounce this word?'
      },
      naturteknik: {
        science: 'What is the process of photosynthesis?',
        technology: 'How does a simple machine work?',
        experiments: 'What happens when you mix these chemicals?',
        nature: 'Which animal is a mammal?'
      }
    };

    const defaultOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
    const subjectQuestions = fallbackQuestions[subject as keyof typeof fallbackQuestions];
    const question = subjectQuestions?.[skillArea as keyof typeof subjectQuestions] || 
                    `Sample question for ${subject} - ${skillArea}`;

    const contentData = {
      question,
      options: defaultOptions,
      correct: 0,
      explanation: `This is a sample question for ${subject} in the ${skillArea} area.`,
      learningObjectives: [`Understanding ${skillArea} concepts in ${subject}`]
    };

    return {
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel,
      title: question,
      content: contentData as any, // Cast to any to handle Json type
      learning_objectives: [`Understanding ${skillArea} concepts in ${subject}`],
      estimated_time: 30
    };
  }
}

export const openaiContentService = new OpenAIContentService();
