
import { supabase } from '@/lib/supabaseClient';

class RealTimeProgressService {
  async updateProgress(
    userId: string,
    subject: string,
    skillArea: string,
    isCorrect: boolean,
    completionTime: number
  ): Promise<boolean> {
    try {
      // Use the existing database function to update user performance
      const { error } = await supabase.rpc('update_user_performance', {
        p_user_id: userId,
        p_subject: subject,
        p_skill_area: skillArea,
        p_is_correct: isCorrect,
        p_completion_time: Math.round(completionTime)
      });

      if (error) {
        console.error('Error updating progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProgress:', error);
      return false;
    }
  }
}

export const realTimeProgressService = new RealTimeProgressService();
