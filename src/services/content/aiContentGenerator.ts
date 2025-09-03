/* @ts-nocheck */\n
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest, GeneratedContent } from '../types/contentTypes';
import { generateTrainingGroundPrompt, buildContextFromAppData, TrainingGroundConfig } from './trainingGroundPromptGenerator';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting generation with unified prompt system');
    console.log('📋 Request:', request);

    try {
      // Build Training Ground prompt using the new unified system
      const promptConfig: TrainingGroundConfig = {
        subject: request.subject,
        gradeLevel: request.gradeLevel?.toString(),
        learningStyle: request.learningStyle,
        studentInterests: request.studentInterests,
        lessonDurationMinutes: request.estimatedTime || 30,
        calendarKeywords: request.calendarKeywords,
        studentAbilities: this.determineAbilityFromRequest(request)
      };

      const promptResult = generateTrainingGroundPrompt(promptConfig);
      console.log('🔥 Prompt sent to AI:', promptResult.prompt);
      console.log('🎯 Generated unified prompt with metadata:', promptResult.metadata);

      console.log('📞 Calling edge function: generate-adaptive-content (using unified prompt)');
      
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          ...request,
          customPrompt: promptResult.prompt,
          promptMetadata: promptResult.metadata
        }
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
      console.log('🎁 Response from AI:', content);
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
        estimatedTime: content.estimatedTime || 30
      };

      console.log('✅ Returning validated content from DeepSeek:', validatedContent);
      return validatedContent;

    } catch (error: any) {
      console.error('💥 AI generation error with unified prompt system:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private determineAbilityFromRequest(request: GenerateContentRequest): 'below' | 'average' | 'above' {
    if (request.studentAbilities?.accuracy) {
      const accuracy = request.studentAbilities.accuracy;
      if (accuracy < 0.7) return 'below';
      if (accuracy > 0.85) return 'above';
    }
    return 'average';
  }
}

export const aiContentGenerator = new AIContentGenerator();
