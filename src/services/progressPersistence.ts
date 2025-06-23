
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

// Helper function to safely convert Json to Record<string, unknown>
const safeJsonToRecord = (json: unknown): Record<string, unknown> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, unknown>;
  }
  return {};
};

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

      if (data) {
        // Map database fields to UserProgress interface with proper type handling
        const mappedProgress: UserProgress = {
          id: data.id,
          user_id: data.user_id,
          subject: data.subject,
          skill_area: data.skill_area,
          current_activity_index: 0, // Default value since not in DB
          score: 0, // Default value since not in DB
          time_elapsed: 0, // Default value since not in DB
          accuracy_rate: data.accuracy_rate,
          attempts_count: data.attempts_count,
          completion_time_avg: data.completion_time_avg,
          current_level: data.current_level,
          engagement_score: data.engagement_score,
          last_assessment: data.last_assessment,
          learning_style: data.learning_style,
          strengths: safeJsonToRecord(data.strengths),
          weaknesses: safeJsonToRecord(data.weaknesses),
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setUserProgress(mappedProgress);
      }
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

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_performance')
        .upsert([progressData], { 
          onConflict: 'user_id,subject,skill_area',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }
};
