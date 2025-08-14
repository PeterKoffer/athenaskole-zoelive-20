
import { supabase } from '@/integrations/supabase/client';
import { GenerateContentRequest } from '../types/contentTypes';
import { GeneratedContent } from '../../types/contentTypes';
import { generateTrainingGroundPrompt, TrainingGroundConfig } from './trainingGroundPromptGenerator';
import { hasAllRequiredParams, LessonParams } from './strictParamsGate';

export class AIContentGenerator {
  async generateAdaptiveContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    console.log('🤖 AIContentGenerator: Starting generation with unified prompt system');
    console.log('📋 Request:', request);

    // Strict params gate - check if we have required parameters
    const params = request as LessonParams;
    const hasAllParams = hasAllRequiredParams(params);
    
    if (!hasAllParams) {
      console.warn('⚠️ Missing required parameters, using catalog fallback');
      return this.getCuratedLessonFromCatalog(params.subject || 'science', params.gradeLevel || '7');
    }

    console.log('✅ All required parameters present, proceeding with AI generation');

    try {
      // Build Training Ground prompt using the new unified system
      const promptConfig: TrainingGroundConfig = {
        subject: request.subject,
        gradeLevel: (request as any).gradeLevel?.toString(),
        learningStyle: (request as any).learningStyle,
        studentInterests: (request as any).studentInterests,
        lessonDurationMinutes: (request as any).estimatedTime || 30,
        calendarKeywords: (request as any).calendarKeywords,
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
        estimatedTime: content.estimatedTime || 30,
        contentSource: 'ai' as const
      };

      console.log('✅ Returning validated content from DeepSeek:', validatedContent);
      return validatedContent;

    } catch (error: any) {
      console.error('💥 AI generation error with unified prompt system:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private determineAbilityFromRequest(request: GenerateContentRequest): 'below' | 'average' | 'above' {
    const abilities = (request as any).studentAbilities;
    if (abilities?.accuracy) {
      const accuracy = abilities.accuracy;
      if (accuracy < 0.7) return 'below';
      if (accuracy > 0.85) return 'above';
    }
    return 'average';
  }

  private async getCuratedLessonFromCatalog(subject: string, gradeLevel: string): Promise<GeneratedContent> {
    // Return a high-quality curated lesson instead of poor AI fallback
    console.log(`📚 Using curated catalog content for ${subject}, grade ${gradeLevel}`);
    
    return {
      question: `What makes ${subject} fascinating for Grade ${gradeLevel} students?`,
      options: [
        `Hands-on experiments and real-world applications`,
        `Interactive discovery and problem-solving`,
        `Connecting concepts to daily life`,
        `Building and creating with ${subject} principles`
      ],
      correct: 0,
      explanation: `${subject} becomes engaging when students can interact with concepts through practical activities, experiments, and real-world connections that make learning meaningful and memorable.`,
      learningObjectives: [`Understand key ${subject} concepts`, 'Apply knowledge through practice'],
      estimatedTime: 30,
      contentSource: 'catalog' as const
    };
  }
}

export const aiContentGenerator = new AIContentGenerator();
