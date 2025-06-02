
import { supabase } from '@/integrations/supabase/client';

export interface LearningSession {
  id?: string;
  user_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  start_time: string;
  end_time?: string;
  time_spent: number;
  score: number;
  completed: boolean;
  content_id?: string;
  user_feedback?: any;
  ai_adjustments?: any;
}

class SessionService {
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: sessionData.user_id!,
          subject: sessionData.subject!,
          skill_area: sessionData.skill_area!,
          difficulty_level: sessionData.difficulty_level || 1,
          start_time: sessionData.start_time || new Date().toISOString(),
          time_spent: sessionData.time_spent || 0,
          score: sessionData.score || 0,
          completed: sessionData.completed || false,
          content_id: sessionData.content_id,
          user_feedback: sessionData.user_feedback || {},
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in saveSession:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: Partial<LearningSession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          end_time: updates.end_time,
          time_spent: updates.time_spent,
          score: updates.score,
          completed: updates.completed,
          user_feedback: updates.user_feedback,
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSession:', error);
      return false;
    }
  }

  async getRecentSessions(userId: string, limit: number = 10): Promise<LearningSession[]> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentSessions:', error);
      return [];
    }
  }
}

export const sessionService = new SessionService();
