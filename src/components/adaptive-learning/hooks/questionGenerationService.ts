
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
    // Enhanced diversity prompts with uniqueness focus
    const diversityPrompts = [
      "Create a COMPLETELY different type of question using unique numbers and scenarios",
      "Use a NEVER-BEFORE-SEEN scenario or context that's totally fresh", 
      "Focus on a DIFFERENT aspect of the topic with creative examples",
      "Create an INNOVATIVE question format with original content",
      "Use CREATIVE examples and situations that haven't been used before",
      "Design a UNIQUE word problem with different characters and settings",
      "Create a FRESH approach to this concept with new real-world applications"
    ];

    const randomDiversityPrompt = diversityPrompts[Math.floor(Math.random() * diversityPrompts.length)];
    const timestamp = Date.now();
    const sessionId = `${userId}-${timestamp}-${Math.random().toString(36).substring(7)}`;

    // Create comprehensive uniqueness instructions with more context
    const uniquenessInstructions = `
ABSOLUTE UNIQUENESS REQUIRED:

Previous questions to COMPLETELY AVOID:
${usedQuestions.slice(-15).map((q, i) => `${i + 1}. ${q.substring(0, 100)}...`).join('\n')}

STRICT REQUIREMENTS:
1. Use COMPLETELY different numbers, scenarios, and contexts
2. Create ORIGINAL word problems with unique characters/settings  
3. Vary mathematical operations and problem types
4. Use creative real-world applications
5. Ensure question is age-appropriate for Grade ${gradeLevel || 5}
6. Make it engaging and educational
7. Avoid repeating any patterns from previous questions
8. Use diverse vocabulary and sentence structures

GENERATION CONTEXT:
- User ID: ${userId.substring(0, 8)}...
- Session ID: ${sessionId}
- Subject: ${subject}
- Skill Area: ${skillArea}
- Difficulty: ${difficultyLevel}/5
- Attempt: ${Math.floor(Math.random() * 1000)}
- Timestamp: ${timestamp}

ENSURE MAXIMUM CREATIVITY AND ORIGINALITY!
`;

    const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
      body: {
        subject,
        skillArea,
        difficultyLevel,
        userId,
        gradeLevel,
        standardsAlignment,
        questionContext: {
          ...questionContext,
          uniquenessInstructions,
          forceUnique: true,
          avoidRepetition: true,
          requireOriginalContent: true,
          maximizeCreativity: true
        },
        previousQuestions: usedQuestions,
        diversityLevel: 'maximum',
        uniqueContext: true,
        creativityBoost: true,
        diversityPrompt: randomDiversityPrompt,
        sessionId,
        avoidRepetition: true,
        uniquenessLevel: 'extreme'
      }
    });

    if (error || !data?.success || !data.generatedContent) {
      throw new Error('AI generation failed - will use fallback');
    }

    const content = data.generatedContent;
    
    return {
      question: content.question,
      options: content.options,
      correct: content.correct,
      explanation: content.explanation || 'Great work on this question!',
      learningObjectives: content.learningObjectives || [],
      estimatedTime: content.estimatedTime || 30,
      conceptsCovered: content.conceptsCovered || [skillArea]
    };
  }

  static isDuplicateQuestion(questionText: string, usedQuestions: string[], isRecap = false): boolean {
    // Allow recap questions to repeat
    if (isRecap) {
      return false;
    }

    const questionTextLower = questionText.toLowerCase().replace(/[^\w\s]/g, '').trim();
    return usedQuestions.some(used => {
      const usedText = used.toLowerCase().replace(/[^\w\s]/g, '').trim();
      // Enhanced similarity detection
      return usedText === questionTextLower || 
             questionTextLower.includes(usedText.substring(0, Math.min(20, usedText.length))) ||
             usedText.includes(questionTextLower.substring(0, Math.min(20, questionTextLower.length))) ||
             this.calculateSimilarity(questionTextLower, usedText) > 0.7;
    });
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }
}
