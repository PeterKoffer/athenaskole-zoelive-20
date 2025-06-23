
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
}

export const userActivityService = new UserActivityService();
