
import { userLearningProfileService } from '../userLearningProfileService';
import { conceptMasteryService } from '../conceptMasteryService';
import { StudentProgressData } from './types';

export class StudentProgressService {
  /**
   * Get student's current progress and learning profile
   */
  static async getStudentProgress(userId: string, subject: string, skillArea: string): Promise<StudentProgressData> {
    try {
      const [profile, conceptMastery] = await Promise.all([
        userLearningProfileService.getLearningProfile(userId, subject, skillArea),
        conceptMasteryService.getConceptMastery(userId, subject)
      ]);

      return {
        currentLevel: profile?.current_difficulty_level || 1,
        strengths: profile?.strengths || [],
        weaknesses: profile?.weaknesses || [],
        masteredConcepts: conceptMastery
          .filter(c => c.masteryLevel > 0.8)
          .map(c => c.conceptName),
        overallAccuracy: profile?.overall_accuracy || 0
      };
    } catch (error) {
      console.warn('Could not load student progress, using defaults:', error);
      return {
        currentLevel: 1,
        strengths: [],
        weaknesses: [],
        masteredConcepts: [],
        overallAccuracy: 0
      };
    }
  }
}
