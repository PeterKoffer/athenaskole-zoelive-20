
import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from './progressPersistence';

export class UserProgressService {
  async getUserProgress(userId: string, subject: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progress:', error);
        return null;
      }

      return data as UserProgress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    try {
      const dbProgressData = {
        user_id: progressData.user_id!,
        subject: progressData.subject!,
        skill_area: progressData.skill_area || 'general',
        current_level: progressData.current_level || 1,
        total_questions: progressData.total_questions || 0,
        correct_answers: progressData.correct_answers || 0,
        accuracy_rate: progressData.accuracy_rate || 0,
        attempts_count: progressData.attempts_count || 0,
        completion_time_avg: progressData.completion_time_avg || 0,
        last_assessment: progressData.last_assessment
      };

      const { error } = await supabase
        .from('user_performance')
        .upsert([dbProgressData], { 
          onConflict: 'user_id,subject,skill_area',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating user progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
  }
}

export const userProgressService = new UserProgressService();
