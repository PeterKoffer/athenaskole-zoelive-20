
import { supabase } from '@/integrations/supabase/client';

export interface UserActivitySession {
  id?: string;
  user_id: string;
  session_type: 'chat' | 'game' | 'lesson' | 'music_creation' | 'ai_tutor';
  subject?: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  completion_status: 'in_progress' | 'completed' | 'abandoned';
  engagement_score?: number;
  metadata?: any;
}

export class UserActivityService {
  async startSession(session: Omit<UserActivitySession, 'id'>): Promise<string | null> {
    try {
      // Map to learning_sessions table since user_activity_sessions doesn't exist
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: session.user_id,
          subject: session.subject || 'general',
          skill_area: session.session_type,
          difficulty_level: 1,
          start_time: session.start_time,
          completed: session.completion_status === 'completed',
          user_feedback: session.metadata || {}
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  }

  async endSession(sessionId: string, engagementScore?: number): Promise<boolean> {
    try {
      const endTime = new Date().toISOString();
      
      // First get the start time to calculate duration
      const { data: sessionData, error: fetchError } = await supabase
        .from('learning_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return false;
      }

      // Calculate duration in minutes
      const startTime = new Date(sessionData.start_time);
      const durationMinutes = Math.round((new Date(endTime).getTime() - startTime.getTime()) / (1000 * 60));

      // Update the session
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          end_time: endTime,
          time_spent: durationMinutes,
          completed: true,
          score: engagementScore || 0
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }

  async abandonSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          completed: false,
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error abandoning session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error abandoning session:', error);
      return false;
    }
  }

  async getUserSessions(userId: string, limit: number = 50): Promise<UserActivitySession[]> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      // Transform learning_sessions data to UserActivitySession format
      return (data || []).map(session => ({
        id: session.id,
        user_id: session.user_id,
        session_type: session.skill_area as 'chat' | 'game' | 'lesson' | 'music_creation' | 'ai_tutor',
        subject: session.subject,
        start_time: session.start_time,
        end_time: session.end_time || undefined,
        duration_minutes: session.time_spent,
        completion_status: session.completed ? 'completed' : 'abandoned',
        engagement_score: session.score || undefined,
        metadata: session.user_feedback
      }));
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async getSessionAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('skill_area, time_spent, score, completed')
        .eq('user_id', userId)
        .gte('start_time', fromDate);

      if (error) {
        console.error('Error fetching session analytics:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          completedSessions: 0,
          totalTimeSpent: 0,
          averageEngagement: 0,
          completionRate: 0,
          sessionTypeBreakdown: {}
        };
      }

      const completedSessions = data.filter(s => s.completed);
      
      const analytics = {
        totalSessions: data.length,
        completedSessions: completedSessions.length,
        totalTimeSpent: completedSessions.reduce((sum, s) => sum + (s.time_spent || 0), 0),
        averageEngagement: completedSessions.length > 0 
          ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length 
          : 0,
        completionRate: data.length ? (completedSessions.length / data.length) * 100 : 0,
        sessionTypeBreakdown: data.reduce((acc, s) => {
          acc[s.skill_area] = (acc[s.skill_area] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return analytics;
    } catch (error) {
      console.error('Error calculating session analytics:', error);
      return null;
    }
  }
}

export const userActivityService = new UserActivityService();
