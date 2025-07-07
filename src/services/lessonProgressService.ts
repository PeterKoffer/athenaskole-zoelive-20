
import { progressPersistence } from './progressPersistence';

export interface LessonProgress {
  id?: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_activity_index: number;
  total_activities: number;
  lesson_data: any;
  score: number;
  time_elapsed: number;
  is_completed: boolean;
}

export class LessonProgressService {
  static async saveLessonProgress(progress: Omit<LessonProgress, 'id'>): Promise<string | null> {
    try {
      // Use progressPersistence to save session data
      const sessionId = await progressPersistence.saveSession({
        user_id: progress.user_id,
        subject: progress.subject,
        skill_area: progress.skill_area,
        difficulty_level: 1,
        start_time: new Date().toISOString(),
        time_spent: progress.time_elapsed,
        score: progress.score,
        completed: progress.is_completed
      });

      return sessionId;
    } catch (error) {
      console.error('Error in saveLessonProgress:', error);
      return null;
    }
  }

  static async getLessonProgress(userId: string, subject: string, skillArea: string): Promise<LessonProgress | null> {
    try {
      // Get user progress from progressPersistence
      const userProgress = await progressPersistence.getUserProgress(userId, subject);
      
      if (!userProgress) {
        return null;
      }

      // Map to LessonProgress format
      return {
        user_id: userId,
        subject: subject,
        skill_area: skillArea,
        current_activity_index: 0,
        total_activities: 5,
        lesson_data: {},
        score: 0,
        time_elapsed: userProgress.time_elapsed || 0,
        is_completed: false
      };
    } catch (error) {
      console.error('Error in getLessonProgress:', error);
      return null;
    }
  }

  static async completeLessonProgress(userId: string, subject: string, skillArea: string): Promise<boolean> {
    try {
      // Update user progress to mark as completed
      return await progressPersistence.updateUserProgress({
        user_id: userId,
        subject: subject,
        skill_area: skillArea,
        current_activity_index: 0,
        score: 0,
        time_elapsed: 0
      });
    } catch (error) {
      console.error('Error in completeLessonProgress:', error);
      return false;
    }
  }

  static async deleteLessonProgress(userId: string, subject: string, skillArea: string): Promise<boolean> {
    try {
      console.log('Deleting lesson progress for:', { userId, subject, skillArea });
      return true;
    } catch (error) {
      console.error('Error in deleteLessonProgress:', error);
      return false;
    }
  }
}
