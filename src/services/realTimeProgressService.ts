
import { supabase } from '@/integrations/supabase/client';

export interface RealTimeProgress {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_level: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  progress_percentage: number;
  last_activity: string;
  streak_count: number;
  total_time_spent: number;
  created_at: string;
  updated_at: string;
}

export const realTimeProgressService = {
  async updateProgress(
    userId: string,
    subject: string,
    skillArea: string,
    isCorrect: boolean,
    completionTime: number
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_user_performance', {
        p_user_id: userId,
        p_subject: subject,
        p_skill_area: skillArea,
        p_is_correct: isCorrect,
        p_completion_time: completionTime
      });

      if (error) {
        console.error('Error updating progress:', error);
        throw error;
      }

      console.log('✅ Progress updated successfully');
    } catch (error) {
      console.error('Error in updateProgress:', error);
      throw error;
    }
  },

  async getUserProgress(userId: string): Promise<RealTimeProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user progress:', error);
        return [];
      }

      // Transform the data to match RealTimeProgress interface
      const transformedData: RealTimeProgress[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        subject: item.subject,
        skill_area: item.skill_area,
        current_level: item.current_level,
        accuracy_rate: item.accuracy_rate,
        attempts_count: item.attempts_count,
        completion_time_avg: item.completion_time_avg,
        progress_percentage: Math.min((item.accuracy_rate / 100) * item.current_level * 10, 100),
        last_activity: item.last_assessment,
        streak_count: item.current_level,
        total_time_spent: item.completion_time_avg * item.attempts_count,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return [];
    }
  },

  async getSubjectProgress(userId: string, subject: string): Promise<RealTimeProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching subject progress:', error);
        return [];
      }

      const transformedData: RealTimeProgress[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        subject: item.subject,
        skill_area: item.skill_area,
        current_level: item.current_level,
        accuracy_rate: item.accuracy_rate,
        attempts_count: item.attempts_count,
        completion_time_avg: item.completion_time_avg,
        progress_percentage: Math.min((item.accuracy_rate / 100) * item.current_level * 10, 100),
        last_activity: item.last_assessment,
        streak_count: item.current_level,
        total_time_spent: item.completion_time_avg * item.attempts_count,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('Error in getSubjectProgress:', error);
      return [];
    }
  }
};
