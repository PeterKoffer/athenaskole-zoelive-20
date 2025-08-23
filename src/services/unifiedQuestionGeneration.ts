// @ts-nocheck
import { globalQuestionUniquenessService, QuestionMetadata } from './globalQuestionUniquenessService';
import { StudentProfile } from '../types/student';

export class UnifiedQuestionGenerationService {
  async generateQuestion(userId: string, metadata: QuestionMetadata): Promise<any> {
    console.log('🔄 Generating unified question for user:', userId);
    
    const studentProfile: StudentProfile = {
      name: 'Student',
      gradeLevel: metadata.gradeLevel || 4,
      interests: metadata.interests || ['space', 'dinosaurs'],
      abilities: { math: 'beginner' },
    };

    const universe = await aiUniverseGenerator.generateUniverse(studentProfile);
    const activity = universe?.activities[0];
    const question = typeof activity === 'string' ? { question: activity } : activity;

    const questionId = globalQuestionUniquenessService.generateUniqueQuestion(userId, metadata);
    
    return {
      id: questionId,
      ...question
    };
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

  async generateUniqueQuestion(userId: string, metadata: QuestionMetadata): Promise<any> {
    return this.generateQuestion(userId, metadata);
  }
}

export const unifiedQuestionGenerationService = new UnifiedQuestionGenerationService();
export const unifiedQuestionGeneration = unifiedQuestionGenerationService;
