
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
  user_feedback?: Record<string, unknown>;
  ai_adjustments?: Record<string, unknown>;
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
          user_feedback: (sessionData.user_feedback || {}) as any, // Cast for Json compatibility
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
          user_feedback: (updates.user_feedback || {}) as any, // Cast for Json compatibility
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

      // Transform the data to match the expected interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        subject: item.subject,
        skill_area: item.skill_area,
        difficulty_level: item.difficulty_level,
        start_time: item.start_time,
        end_time: item.end_time || undefined,
        time_spent: item.time_spent,
        score: item.score,
        completed: item.completed,
        content_id: item.content_id || undefined,
        user_feedback: (typeof item.user_feedback === 'object' && item.user_feedback !== null) 
          ? item.user_feedback as Record<string, unknown> 
          : {},
        ai_adjustments: {}
      }));
    } catch (error) {
      console.error('Error in getRecentSessions:', error);
      return [];
    }
  }
}

export const sessionService = new SessionService();
