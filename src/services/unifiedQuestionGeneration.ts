
// Unified Question Generation Service

import { globalQuestionUniquenessService, QuestionMetadata } from './globalQuestionUniquenessService';

export class UnifiedQuestionGenerationService {
  async generateQuestion(userId: string, metadata: QuestionMetadata): Promise<any> {
    console.log('🔄 Generating unified question for user:', userId);
    
    const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, metadata);
    
    return {
      id: questionId,
      question: `Sample question for ${metadata.subject}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'This is a sample explanation.'
    };
  }

  async generateBatchQuestions(userId: string, count: number, metadata: QuestionMetadata): Promise<any[]> {
    console.log('🔄 Generating batch questions:', count);
    
    const questions = [];
    for (let i = 0; i < count; i++) {
      const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, {
        ...metadata,
        batchIndex: i
      });
      
      questions.push({
        id: questionId,
        question: `Batch question ${i + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4),
        explanation: `Explanation for question ${i + 1}.`
      });
    }
    
    return questions;
  }

  async saveQuestionHistory(userId: string, questionId: string, metadata: QuestionMetadata): Promise<void> {
    console.log('💾 Saving question history:', { userId, questionId, metadata });
    globalQuestionUniquenessService.addQuestionToHistory(userId, questionId);
  }

  async getQuestionHistory(userId: string, metadata: QuestionMetadata): Promise<any[]> {
    console.log('📚 Getting question history for user:', userId);
    const history = globalQuestionUniquenessService.getUserQuestionHistory(userId);
    return history.map(id => ({ id, metadata }));
  }
}

export const unifiedQuestionGenerationService = new UnifiedQuestionGenerationService();
