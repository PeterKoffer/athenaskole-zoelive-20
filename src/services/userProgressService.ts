
import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  user_id: string;
  subject: string;
  skill_area: string;
  current_level: number;
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  last_assessment?: string;
}

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

      if (!data) {
        return null;
      }

      // Map database fields to UserProgress interface
      return {
        user_id: data.user_id,
        subject: data.subject,
        skill_area: data.skill_area,
        current_level: data.current_level,
        total_questions: data.attempts_count, // Use attempts_count as total_questions
        correct_answers: Math.round((data.accuracy_rate / 100) * data.attempts_count), // Calculate from accuracy_rate
        accuracy_rate: data.accuracy_rate,
        attempts_count: data.attempts_count,
        completion_time_avg: data.completion_time_avg,
        last_assessment: data.last_assessment
      };
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
        accuracy_rate: progressData.accuracy_rate || 0,
        attempts_count: progressData.attempts_count || progressData.total_questions || 0,
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
