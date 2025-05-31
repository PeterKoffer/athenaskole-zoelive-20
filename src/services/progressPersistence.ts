
import { supabase } from '@/integrations/supabase/client';

export interface LearningSession {
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

export interface UserProgress {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_level: number;
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  last_assessment?: string;
}

class ProgressPersistenceService {
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    try {
      // Map our session data to match the learning_sessions table schema
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
      // Map updates to match database schema
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

  async getUserProgress(userId: string, subject: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progress:', error);
        return null;
      }

      return data as UserProgress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    try {
      // Map progress data to match user_performance table schema
      const dbProgressData = {
        user_id: progressData.user_id!,
        subject: progressData.subject!,
        skill_area: progressData.skill_area || 'general',
        current_level: progressData.current_level || 1,
        total_questions: progressData.total_questions || 0,
        correct_answers: progressData.correct_answers || 0,
        accuracy_rate: progressData.accuracy_rate || 0,
        attempts_count: progressData.attempts_count || 0,
        completion_time_avg: progressData.completion_time_avg || 0,
        last_assessment: progressData.last_assessment
      };

      const { error } = await supabase
        .from('user_performance')
        .upsert([dbProgressData], { 
          onConflict: 'user_id,subject,skill_area',
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

      return (data || []) as LearningSession[];
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
      const sessions = data as LearningSession[];
      const analytics = {
        totalSessions: sessions.length,
        totalTimeSpent: sessions.reduce((sum, session) => sum + (session.time_spent || 0), 0),
        averageScore: sessions.length > 0 
          ? sessions.reduce((sum, session) => sum + (session.score || 0), 0) / sessions.length 
          : 0,
        difficultyProgression: sessions.map(session => ({
          date: session.start_time,
          level: session.difficulty_level
        })),
        dailyProgress: this.groupSessionsByDay(sessions)
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
          totalScore: 0,
          sessionCount: 0
        };
      }
      acc[date].sessions++;
      acc[date].totalTime += session.time_spent || 0;
      acc[date].totalScore += session.score || 0;
      acc[date].sessionCount++;
      return acc;
    }, {} as any);

    return Object.values(grouped).map((day: any) => ({
      ...day,
      averageScore: day.sessionCount > 0 ? day.totalScore / day.sessionCount : 0
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
