
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_activity_index: number;
  score: number;
  time_elapsed: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  current_level: number;
  engagement_score: number;
  last_assessment: string;
  learning_style: string;
  strengths: Record<string, unknown>;
  weaknesses: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface SessionData {
  user_id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  start_time: string;
  end_time?: string;
  time_spent: number;
  score: number;
  completed: boolean;
}

export const useUserProgress = (userId: string, subject: string, skillArea: string) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProgress = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user progress:', error);
        return;
      }

      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, subject, skillArea]);

  return {
    userProgress,
    isLoading,
    fetchUserProgress
  };
};

export const progressPersistence = {
  async saveSession(sessionData: SessionData): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert([sessionData])
        .select('id')
        .single();

      if (error) {
        console.error('Error saving session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error saving session:', error);
      return null;
    }
  },

  async updateSession(sessionId: string, updates: Partial<SessionData>): Promise<boolean> {
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
};
