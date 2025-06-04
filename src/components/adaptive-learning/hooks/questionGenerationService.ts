
import { supabase } from '@/integrations/supabase/client';
import { Question } from './types';

export class QuestionGenerationService {
  static async generateWithAPI(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    userId: string,
    gradeLevel?: number,
    standardsAlignment?: any,
    questionContext?: any,
    usedQuestions: string[] = []
  ): Promise<Question> {
    const diversityPrompts = [
      "Create a completely different type of question",
      "Use a unique scenario or context",
      "Focus on a different aspect of the topic",
      "Create an innovative question format",
      "Use creative examples and situations"
    ];

    const randomDiversityPrompt = diversityPrompts[Math.floor(Math.random() * diversityPrompts.length)];
    const timestamp = Date.now();

    const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
      body: {
        subject,
        skillArea,
        difficultyLevel,
        userId,
        gradeLevel,
        standardsAlignment,
        questionContext,
        previousQuestions: usedQuestions,
        diversityLevel: 'maximum',
        uniqueContext: true,
        creativityBoost: true,
        diversityPrompt: randomDiversityPrompt,
        sessionId: timestamp,
        avoidRepetition: true
      }
    });

    if (error || !data?.success || !data.generatedContent) {
      throw new Error('AI generation failed');
    }

    const content = data.generatedContent;
    
    return {
      question: content.question,
      options: content.options,
      correct: content.correct,
      explanation: content.explanation || 'Good job!',
      learningObjectives: content.learningObjectives || [],
      estimatedTime: content.estimatedTime || 30,
      conceptsCovered: [skillArea]
    };
  }

  static isDuplicateQuestion(questionText: string, usedQuestions: string[]): boolean {
    const questionTextLower = questionText.toLowerCase().trim();
    return usedQuestions.some(used => {
      const usedText = used.toLowerCase().trim();
      return usedText === questionTextLower || 
             questionTextLower.includes(usedText.substring(0, 15)) ||
             usedText.includes(questionTextLower.substring(0, 15));
    });
  }
}
