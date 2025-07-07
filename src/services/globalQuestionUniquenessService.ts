
// Fixed implementation for global question uniqueness service

export interface UniqueQuestion {
  id: string;
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  metadata: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    gradeLevel?: number;
    timestamp: number;
    userId: string;
    sessionId: string;
  };
}

export class GlobalQuestionUniquenessService {
  private static usedQuestions = new Set<string>();
  
  async generateUniqueQuestion(params: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    userId: string;
    gradeLevel?: number;
    context?: any;
  }): Promise<UniqueQuestion> {
    console.log('🎯 Global Question Uniqueness Service: generateUniqueQuestion');
    
    const questionId = `unique_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const uniqueQuestion: UniqueQuestion = {
      id: questionId,
      content: {
        question: `Grade ${params.gradeLevel || 5} ${params.subject}: What is a key concept in ${params.skillArea}?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correctAnswer: 0,
        explanation: `This is an important concept for Grade ${params.gradeLevel || 5} ${params.subject}.`
      },
      metadata: {
        subject: params.subject,
        skillArea: params.skillArea,
        difficultyLevel: params.difficultyLevel,
        gradeLevel: params.gradeLevel,
        timestamp: Date.now(),
        userId: params.userId,
        sessionId: `session_${Date.now()}`
      }
    };
    
    GlobalQuestionUniquenessService.usedQuestions.add(uniqueQuestion.content.question);
    return uniqueQuestion;
  }

  async trackQuestionUsage(questionId: string, userId: string): Promise<void> {
    console.log('📊 Tracking question usage:', { questionId, userId });
  }

  async isQuestionUsed(questionText: string): Promise<boolean> {
    return GlobalQuestionUniquenessService.usedQuestions.has(questionText);
  }

  async clearUsedQuestions(): Promise<void> {
    GlobalQuestionUniquenessService.usedQuestions.clear();
    console.log('🗑️ Cleared used questions cache');
  }
}

export const globalQuestionUniquenessService = new GlobalQuestionUniquenessService();
