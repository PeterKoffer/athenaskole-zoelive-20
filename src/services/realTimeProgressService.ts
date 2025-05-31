
import { supabase } from '@/integrations/supabase/client';

export interface RealTimeProgress {
  id?: string;
  user_id: string;
  subject: string;
  skill_area: string;
  progress_percentage: number;
  last_activity: string;
  streak_count: number;
  total_time_spent: number;
  achievements: any[];
  updated_at?: string;
}

export class RealTimeProgressService {
  async updateProgress(
    userId: string,
    subject: string,
    skillArea: string,
    timeSpent: number,
    progressDelta: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_real_time_progress', {
        p_user_id: userId,
        p_subject: subject,
        p_skill_area: skillArea,
        p_time_spent: timeSpent,
        p_progress_delta: progressDelta
      });

      if (error) {
        console.error('Error updating real-time progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating real-time progress:', error);
      return false;
    }
  }

  async getUserProgress(userId: string): Promise<RealTimeProgress[]> {
    try {
      const { data, error } = await supabase
        .from('real_time_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Error fetching user progress:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        achievements: Array.isArray(item.achievements) ? item.achievements : []
      }));
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }

  async getSubjectProgress(userId: string, subject: string): Promise<RealTimeProgress[]> {
    try {
      const { data, error } = await supabase
        .from('real_time_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .order('skill_area');

      if (error) {
        console.error('Error fetching subject progress:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        achievements: Array.isArray(item.achievements) ? item.achievements : []
      }));
    } catch (error) {
      console.error('Error fetching subject progress:', error);
      return [];
    }
  }

  async addAchievement(userId: string, subject: string, skillArea: string, achievement: any): Promise<boolean> {
    try {
      // First get current achievements
      const { data: current, error: fetchError } = await supabase
        .from('real_time_progress')
        .select('achievements')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching current achievements:', fetchError);
        return false;
      }

      const currentAchievements = Array.isArray(current?.achievements) ? current.achievements : [];
      const updatedAchievements = [...currentAchievements, achievement];

      const { error } = await supabase
        .from('real_time_progress')
        .update({ achievements: updatedAchievements })
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea);

      if (error) {
        console.error('Error adding achievement:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return false;
    }
  }
}

export const realTimeProgressService = new RealTimeProgressService();
