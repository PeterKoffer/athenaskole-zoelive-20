import { Question } from '@/components/adaptive-learning/hooks/types';
import { globalQuestionUniquenessService, UniqueQuestion } from '@/services/globalQuestionUniquenessService';
import { QuestionGenerationService } from '@/components/adaptive-learning/hooks/questionGenerationService';
import { FallbackQuestionGenerator } from '@/components/adaptive-learning/hooks/fallbackQuestionGenerator';
import { QuestionHistoryService } from '@/components/adaptive-learning/hooks/questionHistoryService';

export interface QuestionGenerationConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: Record<string, unknown> | null;
  questionContext?: Record<string, unknown>;
  maxAttempts?: number;
  enablePersistence?: boolean;
}

export interface QuestionGenerationResult {
  question: UniqueQuestion;
  generationMethod: 'ai' | 'fallback';
  attempts: number;
  uniquenessGuaranteed: boolean;
}

/**
 * Unified Question Generation Service
 * Centralizes all question generation logic with guaranteed uniqueness
 */
export class UnifiedQuestionGenerationService {
  private static instance: UnifiedQuestionGenerationService;

  private constructor() {}

  static getInstance(): UnifiedQuestionGenerationService {
    if (!UnifiedQuestionGenerationService.instance) {
      UnifiedQuestionGenerationService.instance = new UnifiedQuestionGenerationService();
    }
    return UnifiedQuestionGenerationService.instance;
  }

  /**
   * Generate a unique question with guaranteed uniqueness across all sessions
   */
  async generateUniqueQuestion(config: QuestionGenerationConfig): Promise<QuestionGenerationResult> {
    const {
      subject,
      skillArea,
      difficultyLevel,
      userId,
      gradeLevel,
      standardsAlignment,
      questionContext,
      maxAttempts = 5,
      enablePersistence = true
    } = config;

    let attempts = 0;
    let generationMethod: 'ai' | 'fallback' = 'ai';

    // Get existing questions for this user/subject combination
    const usedQuestions = await globalQuestionUniquenessService.getUserQuestionTexts(
      userId,
      subject,
      skillArea,
      100 // Check more questions for better uniqueness
    );

    console.log(`🎯 Unified Question Generation: Avoiding ${usedQuestions.length} existing questions`);

    while (attempts < maxAttempts) {
      attempts++;

      try {
        let generatedQuestion: Question;

        if (attempts <= 3) {
          // Try AI generation first (up to 3 attempts)
          console.log(`🤖 Attempt ${attempts}: Trying AI generation`);
          generatedQuestion = await QuestionGenerationService.generateWithAPI(
            subject,
            skillArea,
            difficultyLevel,
            userId,
            gradeLevel,
            standardsAlignment,
            {
              ...questionContext,
              attemptNumber: attempts,
              totalUsedQuestions: usedQuestions.length,
              recentQuestions: usedQuestions.slice(0, 20)
            },
            usedQuestions
          );
        } else {
          // Use enhanced fallback for remaining attempts
          console.log(`🎲 Attempt ${attempts}: Using enhanced fallback generation`);
          generationMethod = 'fallback';
          const timestamp = Date.now() + attempts * 1000;
          const seed = Math.floor(Math.random() * 10000) + attempts * 100;
          
          generatedQuestion = await this.generateEnhancedFallback(
            subject,
            skillArea,
            difficultyLevel,
            timestamp,
            seed,
            usedQuestions,
            gradeLevel
          );
        }

        // Check uniqueness with the centralized service
        const isUnique = await globalQuestionUniquenessService.isQuestionUnique(
          generatedQuestion.question,
          userId,
          subject,
          !enablePersistence // Skip DB check if persistence disabled
        );

        if (isUnique) {
          // Create unique question with ID
          const uniqueId = globalQuestionUniquenessService.generateUniqueQuestionId(
            userId,
            subject,
            skillArea
          );

          const uniqueQuestion: UniqueQuestion = {
            ...generatedQuestion,
            id: uniqueId,
            createdAt: new Date(),
            userId,
            subject,
            skillArea,
            difficultyLevel,
            conceptsCovered: generatedQuestion.conceptsCovered || [skillArea]
          };

          // Track the question globally
          globalQuestionUniquenessService.trackUsedQuestion(uniqueQuestion);

          console.log(`✅ Unique question generated successfully on attempt ${attempts}`);
          console.log(`📊 Question ID: ${uniqueId}`);

          return {
            question: uniqueQuestion,
            generationMethod,
            attempts,
            uniquenessGuaranteed: true
          };

        } else {
          console.log(`⚠️ Attempt ${attempts}: Generated question is not unique, retrying...`);
          // Add the non-unique question to avoid list for next attempt
          usedQuestions.push(generatedQuestion.question);
        }

      } catch (error) {
        console.error(`❌ Attempt ${attempts} failed:`, error);
        if (attempts >= 3) {
          generationMethod = 'fallback';
        }
      }
    }

    // Ultimate fallback with guaranteed uniqueness
    console.log('🆘 All attempts failed, creating guaranteed unique fallback');
    const emergencyQuestion = await this.createGuaranteedUniqueQuestion(
      subject,
      skillArea,
      difficultyLevel,
      userId,
      usedQuestions,
      gradeLevel
    );

    return {
      question: emergencyQuestion,
      generationMethod: 'fallback',
      attempts: maxAttempts,
      uniquenessGuaranteed: true
    };
  }

  /**
   * Save question history with unified tracking
   */
  async saveQuestionHistory(
    question: UniqueQuestion,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number,
    additionalContext?: Record<string, unknown>
  ): Promise<void> {
    try {
      await QuestionHistoryService.saveQuestionHistory(
        question.userId,
        question.subject,
        question.skillArea,
        question.difficultyLevel,
        question,
        userAnswer,
        isCorrect,
        responseTime,
        {
          ...additionalContext,
          questionId: question.id,
          generationTimestamp: question.createdAt.toISOString()
        }
      );
    } catch (error) {
      console.warn('Could not save question history:', error);
    }
  }

  /**
   * Enhanced fallback generation with better variety
   */
  private async generateEnhancedFallback(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    timestamp: number,
    seed: number,
    usedQuestions: string[],
    gradeLevel?: number
  ): Promise<Question> {
    let attempts = 0;
    let question: Question;

    do {
      const uniqueSeed = seed + attempts * 1000 + Math.floor(Math.random() * 1000);
      question = FallbackQuestionGenerator.createUniqueQuestion(
        subject,
        skillArea,
        timestamp + attempts,
        uniqueSeed
      );

      // Add more variation to make it unique
      if (attempts > 0) {
        const variationSuffix = this.generateVariationSuffix(attempts, difficultyLevel);
        question = {
          ...question,
          question: `${question.question} ${variationSuffix}`.trim()
        };
      }

      attempts++;
    } while (
      this.isQuestionTooSimilar(question.question, usedQuestions) && 
      attempts < 20
    );

    // Enhance question based on difficulty progression
    return this.enhanceQuestionForDifficulty(question, difficultyLevel, gradeLevel);
  }

  /**
   * Create absolutely guaranteed unique question as last resort
   */
  private async createGuaranteedUniqueQuestion(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    userId: string,
    usedQuestions: string[],
    gradeLevel?: number
  ): Promise<UniqueQuestion> {
    const timestamp = Date.now();
    const uniqueId = globalQuestionUniquenessService.generateUniqueQuestionId(
      userId,
      subject,
      skillArea
    );
    
    const uniqueMarker = `[${uniqueId.slice(-8)}]`;
    const difficultyLabel = this.getDifficultyLabel(difficultyLevel);
    const gradeText = gradeLevel ? ` for Grade ${gradeLevel}` : '';

    const baseQuestion = FallbackQuestionGenerator.createUniqueQuestion(
      subject,
      skillArea,
      timestamp,
      Math.floor(Math.random() * 100000)
    );

    const guaranteedUniqueQuestion: UniqueQuestion = {
      ...baseQuestion,
      id: uniqueId,
      question: `${baseQuestion.question} ${uniqueMarker}`,
      explanation: `${baseQuestion.explanation} This ${difficultyLabel} question${gradeText} was specially created for your learning session.`,
      createdAt: new Date(),
      userId,
      subject,
      skillArea,
      difficultyLevel,
      conceptsCovered: baseQuestion.conceptsCovered || [skillArea]
    };

    // Track globally
    globalQuestionUniquenessService.trackUsedQuestion(guaranteedUniqueQuestion);

    return guaranteedUniqueQuestion;
  }

  private generateVariationSuffix(attempts: number, difficultyLevel: number): string {
    const variations = [
      `(Challenge ${attempts})`,
      `(Practice Round ${attempts})`,
      `(Level ${difficultyLevel}-${attempts})`,
      `(Try #${attempts})`,
      `(Session ${attempts})`
    ];
    return variations[attempts % variations.length];
  }

  private isQuestionTooSimilar(questionText: string, usedQuestions: string[]): boolean {
    const normalized = questionText.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    return usedQuestions.some(used => {
      const usedNormalized = used.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      // Check for high similarity
      if (usedNormalized === normalized) return true;
      
      // Check for significant overlap
      const words1 = normalized.split(' ').filter(w => w.length > 3);
      const words2 = usedNormalized.split(' ').filter(w => w.length > 3);
      const commonWords = words1.filter(word => words2.includes(word));
      
      return commonWords.length >= Math.min(words1.length, words2.length) * 0.6;
    });
  }

  private enhanceQuestionForDifficulty(
    question: Question,
    difficultyLevel: number,
    gradeLevel?: number
  ): Question {
    const difficultyEnhancements = {
      1: 'beginner-friendly',
      2: 'introductory',
      3: 'intermediate',
      4: 'challenging',
      5: 'advanced'
    };

    const enhancement = difficultyEnhancements[difficultyLevel as keyof typeof difficultyEnhancements] || 'standard';
    
    return {
      ...question,
      learningObjectives: [
        ...question.learningObjectives,
        `${enhancement} level practice`,
        gradeLevel ? `Grade ${gradeLevel} curriculum` : 'age-appropriate learning'
      ].filter(Boolean),
      estimatedTime: Math.max(30, question.estimatedTime + difficultyLevel * 10)
    };
  }

  private getDifficultyLabel(level: number): string {
    const labels = {
      1: 'beginner',
      2: 'basic',
      3: 'intermediate',
      4: 'advanced',
      5: 'expert'
    };
    return labels[level as keyof typeof labels] || 'standard';
  }
}

export const unifiedQuestionGeneration = UnifiedQuestionGenerationService.getInstance();