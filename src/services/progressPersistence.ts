
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
const safeJsonToRecord = (json: any): Record<string, unknown> => {
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
  },

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

      if (!data) {
        return null;
      }

      // Map database fields to UserProgress interface with proper type handling
      return {
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
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },

  async updateUserProgress(progressData: Partial<UserProgress>): Promise<boolean> {
    try {
      // Convert UserProgress to database format, excluding fields not in DB schema
      const dbData = {
        user_id: progressData.user_id!,
        subject: progressData.subject!,
        skill_area: progressData.skill_area!,
        accuracy_rate: progressData.accuracy_rate || 0,
        attempts_count: progressData.attempts_count || 0,
        completion_time_avg: progressData.completion_time_avg || 0,
        current_level: progressData.current_level || 1,
        engagement_score: progressData.engagement_score || 0,
        last_assessment: progressData.last_assessment || new Date().toISOString(),
        learning_style: progressData.learning_style || 'visual',
        strengths: progressData.strengths || {},
        weaknesses: progressData.weaknesses || {},
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('user_performance')
        .upsert(dbData, { 
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
};
