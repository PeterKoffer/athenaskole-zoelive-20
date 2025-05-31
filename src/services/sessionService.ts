
import { supabase } from '@/integrations/supabase/client';

// Import the interface from progressPersistence to avoid circular dependency
interface LearningSession {
  id: string;
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

export class SessionService {
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    try {
      const dbSessionData = {
        user_id: sessionData.user_id!,
        subject: sessionData.subject!,
        skill_area: sessionData.skill_area || 'general',
        difficulty_level: sessionData.difficulty_level || 1,
        start_time: sessionData.start_time || new Date().toISOString(),
        time_spent: sessionData.time_spent || 0,
        score: sessionData.score || 0,
        completed: sessionData.completed || false,
        content_id: sessionData.content_id,
        user_feedback: sessionData.user_feedback,
        ai_adjustments: sessionData.ai_adjustments
      };

      const { data, error } = await supabase
        .from('learning_sessions')
        .insert([dbSessionData])
        .select()
        .single();

      if (error) {
        console.error('Error saving session:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error saving session:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: Partial<LearningSession>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      
      if (updates.end_time) dbUpdates.end_time = updates.end_time;
      if (updates.time_spent !== undefined) dbUpdates.time_spent = updates.time_spent;
      if (updates.score !== undefined) dbUpdates.score = updates.score;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.user_feedback) dbUpdates.user_feedback = updates.user_feedback;
      if (updates.ai_adjustments) dbUpdates.ai_adjustments = updates.ai_adjustments;

      const { error } = await supabase
        .from('learning_sessions')
        .update(dbUpdates)
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating session:', error);
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
        console.error('Error fetching recent sessions:', error);
        return [];
      }

      return (data || []) as LearningSession[];
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      return [];
    }
  }
}

export const sessionService = new SessionService();
