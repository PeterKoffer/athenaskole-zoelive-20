
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
      const { data, error } = await supabase
        .from('user_activity_sessions')
        .insert([{
          ...session,
          start_time: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  }

  async endSession(sessionId: string, engagementScore?: number): Promise<boolean> {
    try {
      const endTime = new Date().toISOString();
      
      // Get session start time to calculate duration
      const { data: session, error: fetchError } = await supabase
        .from('user_activity_sessions')
        .select('start_time')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        return false;
      }

      const startTime = new Date(session.start_time);
      const duration = Math.round((new Date(endTime).getTime() - startTime.getTime()) / 1000 / 60);

      const { error } = await supabase
        .from('user_activity_sessions')
        .update({
          end_time: endTime,
          duration_minutes: duration,
          completion_status: 'completed',
          engagement_score: engagementScore
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
        .from('user_activity_sessions')
        .update({
          completion_status: 'abandoned',
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
        .from('user_activity_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        session_type: item.session_type as 'chat' | 'game' | 'lesson' | 'music_creation' | 'ai_tutor',
        completion_status: item.completion_status as 'in_progress' | 'completed' | 'abandoned'
      }));
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async getSessionAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_activity_sessions')
        .select('session_type, duration_minutes, engagement_score, completion_status')
        .eq('user_id', userId)
        .gte('start_time', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching session analytics:', error);
        return null;
      }

      const completedSessions = data?.filter(s => s.completion_status === 'completed') || [];
      
      const analytics = {
        totalSessions: data?.length || 0,
        completedSessions: completedSessions.length,
        totalTimeSpent: completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
        averageEngagement: completedSessions.length > 0 
          ? completedSessions.reduce((sum, s) => sum + (s.engagement_score || 0), 0) / completedSessions.length 
          : 0,
        completionRate: data?.length ? (completedSessions.length / data.length) * 100 : 0,
        sessionTypeBreakdown: data?.reduce((acc, s) => {
          acc[s.session_type] = (acc[s.session_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      };

      return analytics;
    } catch (error) {
      console.error('Error calculating session analytics:', error);
      return null;
    }
  }
}

export const userActivityService = new UserActivityService();
