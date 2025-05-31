
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface LearningSession {
  id: string;
  user_id: string;
  subject: string;
  activity_type: string;
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  questions_answered: number;
  correct_answers: number;
  difficulty_level: number;
  completed: boolean;
  performance_metrics: {
    accuracy: number;
    averageResponseTime: number;
    difficultyProgression: number[];
    struggledConcepts: string[];
  };
}

export interface UserProgress {
  user_id: string;
  subject: string;
  current_level: number;
  total_time_spent: number;
  sessions_completed: number;
  average_accuracy: number;
  learning_streak: number;
  last_session_date: string;
  strengths: string[];
  weaknesses: string[];
  preferred_difficulty: number;
}

class ProgressPersistenceService {
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert([sessionData])
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
      const { error } = await supabase
        .from('learning_sessions')
        .update(updates)
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

  async getUserProgress(userId: string, subject: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert([progressData], { 
          onConflict: 'user_id,subject',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating user progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user progress:', error);
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

      return data || [];
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      return [];
    }
  }

  async getPerformanceAnalytics(userId: string, subject: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .gte('start_time', startDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching analytics:', error);
        return null;
      }

      // Process data for analytics
      const analytics = {
        totalSessions: data.length,
        totalTimeSpent: data.reduce((sum, session) => sum + session.duration_minutes, 0),
        averageAccuracy: data.length > 0 
          ? data.reduce((sum, session) => sum + (session.correct_answers / session.questions_answered * 100), 0) / data.length 
          : 0,
        difficultyProgression: data.map(session => ({
          date: session.start_time,
          level: session.difficulty_level
        })),
        dailyProgress: this.groupSessionsByDay(data)
      };

      return analytics;
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return null;
    }
  }

  private groupSessionsByDay(sessions: LearningSession[]): any[] {
    const grouped = sessions.reduce((acc, session) => {
      const date = session.start_time.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          sessions: 0,
          totalTime: 0,
          totalAccuracy: 0,
          questionsAnswered: 0
        };
      }
      acc[date].sessions++;
      acc[date].totalTime += session.duration_minutes;
      acc[date].totalAccuracy += (session.correct_answers / session.questions_answered * 100);
      acc[date].questionsAnswered += session.questions_answered;
      return acc;
    }, {} as any);

    return Object.values(grouped).map((day: any) => ({
      ...day,
      averageAccuracy: day.totalAccuracy / day.sessions
    }));
  }

  calculateLearningStreak(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0;

    const today = new Date();
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    let streak = 0;
    let currentDate = today;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.start_time);
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak + 1) {
        break;
      }
    }

    return streak;
  }
}

export const progressPersistence = new ProgressPersistenceService();
