
// Scalable Question Generation Service

import { globalQuestionUniquenessService } from './globalQuestionUniquenessService';

export class ScalableQuestionGenerationService {
  async generateQuestion(userId: string, subject: string, difficulty: number): Promise<any> {
    console.log('🔄 Generating question for user:', userId);
    
    // Get user's question history
    const history = globalQuestionUniquenessService.getUserQuestionHistory(userId);
    console.log('📚 User question history length:', history.length);
    
    // Generate unique question
    const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, {
      subject,
      difficulty,
      timestamp: Date.now()
    });
    
    return {
      id: questionId,
      question: `Sample ${subject} question (difficulty: ${difficulty})`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      explanation: 'This is a sample explanation.'
    };
  }

  async generateBatchQuestions(userId: string, count: number, subject: string): Promise<any[]> {
    console.log('🔄 Generating batch questions:', count);
    
    const questions = [];
    for (let i = 0; i < count; i++) {
      const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, {
        subject,
        batchIndex: i,
        timestamp: Date.now()
      });
      
      questions.push({
        id: questionId,
        question: `Batch question ${i + 1} for ${subject}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4),
        explanation: `Explanation for question ${i + 1}.`
      });
    }
    
    return questions;
  }

  async getQuestionRecommendations(userId: string): Promise<any[]> {
    console.log('💡 Getting question recommendations for user:', userId);
    
    // Get user's question history for recommendations
    const history = globalQuestionUniquenessService.getUserQuestionHistory(userId);
    
    return [
      {
        id: 'rec_1',
        subject: 'Mathematics',
        difficulty: 3,
        reason: 'Based on your recent performance'
      },
      {
        id: 'rec_2',
        subject: 'Science',
        difficulty: 2,
        reason: 'New topic exploration'
      }
    ];
  }

  getSystemStats(): any {
    return {
      totalQuestions: 100,
      activeUsers: 25,
      averageResponseTime: 1200
    };
  }
}

export const scalableQuestionGenerationService = new ScalableQuestionGenerationService();
export const scalableQuestionGeneration = scalableQuestionGenerationService;
