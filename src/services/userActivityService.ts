
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
      // Use raw query since the table might not be in types yet
      const { data, error } = await supabase
        .rpc('exec_sql', {
          sql: `
            INSERT INTO user_activity_sessions (user_id, session_type, subject, start_time, completion_status, metadata)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `,
          params: [
            session.user_id,
            session.session_type,
            session.subject,
            new Date().toISOString(),
            session.completion_status,
            JSON.stringify(session.metadata || {})
          ]
        });

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      return data?.[0]?.id || null;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  }

  async endSession(sessionId: string, engagementScore?: number): Promise<boolean> {
    try {
      const endTime = new Date().toISOString();
      
      // Use raw query to update session
      const { error } = await supabase
        .rpc('exec_sql', {
          sql: `
            UPDATE user_activity_sessions 
            SET end_time = $1, 
                duration_minutes = EXTRACT(EPOCH FROM ($1::timestamp - start_time)) / 60,
                completion_status = 'completed',
                engagement_score = $2
            WHERE id = $3
          `,
          params: [endTime, engagementScore, sessionId]
        });

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
        .rpc('exec_sql', {
          sql: `
            UPDATE user_activity_sessions 
            SET completion_status = 'abandoned', end_time = $1
            WHERE id = $2
          `,
          params: [new Date().toISOString(), sessionId]
        });

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
        .rpc('exec_sql', {
          sql: `
            SELECT * FROM user_activity_sessions 
            WHERE user_id = $1 
            ORDER BY start_time DESC 
            LIMIT $2
          `,
          params: [userId, limit]
        });

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async getSessionAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT session_type, duration_minutes, engagement_score, completion_status
            FROM user_activity_sessions 
            WHERE user_id = $1 
            AND start_time >= $2
          `,
          params: [userId, new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()]
        });

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
