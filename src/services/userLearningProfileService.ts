
import { supabase } from '@/integrations/supabase/client';

export interface UserLearningProfile {
  user_id: string;
  attention_span_minutes: number;
  average_response_time: number;
  consistency_score: number;
  current_difficulty_level: number;
  difficulty_adjustments: Record<string, unknown>;
  engagement_patterns: Record<string, unknown>;
  frustration_indicators: Record<string, unknown>;
  last_updated: string;
  learning_pace: string;
  learning_preferences: Record<string, unknown>;
  motivation_triggers: Record<string, unknown>;
  optimal_session_length: number;
  performance_trends: Record<string, unknown>;
  problem_solving_approach: string;
  retention_rate: number;
  social_learning_preference: string;
  strengths: string[];
  subject_preferences: Record<string, unknown>;
  task_completion_rate: number;
  weaknesses: string[];
}

export class UserLearningProfileService {
  async getProfile(userId: string): Promise<UserLearningProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching learning profile:', error);
        return null;
      }

      if (!data) return null;

      // Convert database data to UserLearningProfile format with proper type casting
      const profile: UserLearningProfile = {
        user_id: data.user_id,
        attention_span_minutes: data.attention_span_minutes || 20,
        average_response_time: data.average_response_time || 3.0,
        consistency_score: data.consistency_score || 0.5,
        current_difficulty_level: data.current_difficulty_level || 1,
        difficulty_adjustments: (typeof data.difficulty_adjustments === 'object' && data.difficulty_adjustments !== null) 
          ? data.difficulty_adjustments as Record<string, unknown> 
          : {},
        engagement_patterns: (typeof data.engagement_patterns === 'object' && data.engagement_patterns !== null) 
          ? data.engagement_patterns as Record<string, unknown> 
          : {},
        frustration_indicators: (typeof data.frustration_indicators === 'object' && data.frustration_indicators !== null) 
          ? data.frustration_indicators as Record<string, unknown> 
          : {},
        last_updated: data.last_updated || new Date().toISOString(),
        learning_pace: data.learning_pace || 'moderate',
        learning_preferences: (typeof data.learning_preferences === 'object' && data.learning_preferences !== null) 
          ? data.learning_preferences as Record<string, unknown> 
          : {},
        motivation_triggers: (typeof data.motivation_triggers === 'object' && data.motivation_triggers !== null) 
          ? data.motivation_triggers as Record<string, unknown> 
          : {},
        optimal_session_length: data.optimal_session_length || 20,
        performance_trends: (typeof data.performance_trends === 'object' && data.performance_trends !== null) 
          ? data.performance_trends as Record<string, unknown> 
          : {},
        problem_solving_approach: data.problem_solving_approach || 'systematic',
        retention_rate: data.retention_rate || 0.5,
        social_learning_preference: data.social_learning_preference || 'individual',
        strengths: Array.isArray(data.strengths) ? data.strengths.filter((s): s is string => typeof s === 'string') : [],
        subject_preferences: (typeof data.subject_preferences === 'object' && data.subject_preferences !== null) 
          ? data.subject_preferences as Record<string, unknown> 
          : {},
        task_completion_rate: data.task_completion_rate || 0.5,
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.filter((w): w is string => typeof w === 'string') : []
      };

      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserLearningProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_learning_profiles')
        .upsert({
          user_id: userId,
          ...updates,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating learning profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  }
}

export const userLearningProfileService = new UserLearningProfileService();
