import { supabase } from '@/integrations/supabase/client';

export interface UserActivitySession {
  id: string;
  user_id: string;
  session_type: 'lesson' | 'game' | 'chat' | 'ai_tutor' | 'music_creation';
  subject: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  completion_status: 'completed' | 'abandoned';
  engagement_score: number;
  metadata: Record<string, unknown>;
}

export class UserActivityService {
  async logActivity(sessionData: Partial<UserActivitySession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: sessionData.user_id!,
          subject: sessionData.subject!,
          skill_area: 'general',
          difficulty_level: 1,
          start_time: sessionData.start_time || new Date().toISOString(),
          end_time: sessionData.end_time,
          time_spent: sessionData.duration_minutes || 0,
          score: sessionData.engagement_score || 0,
          completed: sessionData.completion_status === 'completed',
          user_feedback: (sessionData.metadata || {}) as any
        });

      if (error) {
        console.error('Error logging activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in logActivity:', error);
      return false;
    }
  }

  async getRecentActivities(userId: string, limit: number = 10): Promise<UserActivitySession[]> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        return [];
      }

      // Transform database records to UserActivitySession format
      const activities: UserActivitySession[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        session_type: 'lesson' as const,
        subject: item.subject,
        start_time: item.start_time,
        end_time: item.end_time || item.start_time,
        duration_minutes: item.time_spent,
        completion_status: item.completed ? 'completed' as const : 'abandoned' as const,
        engagement_score: item.score,
        metadata: (typeof item.user_feedback === 'object' && item.user_feedback !== null) 
          ? item.user_feedback as Record<string, unknown> 
          : {}
      }));

      return activities;
    } catch (error) {
      console.error('Error in getRecentActivities:', error);
      return [];
    }
  }

  async startSession(sessionData: any): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: sessionData.user_id,
          subject: sessionData.subject || 'general',
          skill_area: 'general',
          difficulty_level: 1,
          start_time: sessionData.start_time || new Date().toISOString(),
          time_spent: 0,
          score: 0,
          completed: false,
          user_feedback: sessionData.metadata || {}
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in startSession:', error);
      return null;
    }
  }

  async endSession(sessionId: string, engagementScore?: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          end_time: new Date().toISOString(),
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
      console.error('Error in endSession:', error);
      return false;
    }
  }

  async abandonSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          end_time: new Date().toISOString(),
          completed: false
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error abandoning session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in abandonSession:', error);
      return false;
    }
  }

  async getSessionAnalytics(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching session analytics:', error);
        return null;
      }

      const sessions = data || [];
      const totalTimeSpent = sessions.reduce((sum, session) => sum + (session.time_spent || 0), 0);
      const completedSessions = sessions.filter(s => s.completed).length;
      const totalSessions = sessions.length;
      const averageEngagement = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
        : 0;

      return {
        totalTimeSpent: Math.round(totalTimeSpent),
        totalSessions,
        completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        averageEngagement,
        sessionTypeBreakdown: sessions.reduce((acc, session) => {
          const type = 'lesson'; // Default since we don't have session_type in the schema
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      console.error('Error in getSessionAnalytics:', error);
      return null;
    }
  }
}

export const userActivityService = new UserActivityService();
