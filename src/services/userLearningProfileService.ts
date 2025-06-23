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
  accuracy_rate?: number; // Changed from overall_accuracy to accuracy_rate
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
        engagement_patterns: {},
        frustration_indicators: {},
        last_updated: data.created_at || new Date().toISOString(),
        learning_pace: 'moderate', // Default since not in DB
        learning_preferences: (typeof data.difficulty_adjustments === 'object' && data.difficulty_adjustments !== null) 
          ? data.difficulty_adjustments as Record<string, unknown> 
          : {},
        motivation_triggers: {},
        optimal_session_length: data.attention_span_minutes || 20, // Use attention_span as session length
        performance_trends: {},
        problem_solving_approach: 'systematic', // Default since not in DB
        retention_rate: data.consistency_score || 0.5, // Use consistency as retention
        social_learning_preference: 'individual', // Default since not in DB
        strengths: Array.isArray(data.strengths) ? data.strengths.filter((s): s is string => typeof s === 'string') : [],
        subject_preferences: {},
        task_completion_rate: data.consistency_score || 0.5, // Use consistency as completion rate
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.filter((w): w is string => typeof w === 'string') : [],
        accuracy_rate: data.consistency_score || 0.5
      };

      return profile;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserLearningProfile>): Promise<boolean> {
    try {
      // Map our interface to database fields
      const dbUpdates: any = {
        user_id: userId,
      };

      // Only map fields that exist in the database
      if (updates.attention_span_minutes !== undefined) dbUpdates.attention_span_minutes = updates.attention_span_minutes;
      if (updates.average_response_time !== undefined) dbUpdates.average_response_time = updates.average_response_time;
      if (updates.consistency_score !== undefined) dbUpdates.consistency_score = updates.consistency_score;
      if (updates.current_difficulty_level !== undefined) dbUpdates.current_difficulty_level = updates.current_difficulty_level;
      if (updates.difficulty_adjustments !== undefined) dbUpdates.difficulty_adjustments = updates.difficulty_adjustments;
      if (updates.strengths !== undefined) dbUpdates.strengths = updates.strengths;
      if (updates.weaknesses !== undefined) dbUpdates.weaknesses = updates.weaknesses;

      const { error } = await supabase
        .from('user_learning_profiles')
        .upsert(dbUpdates);

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

  async getUserPreferences(userId: string): Promise<any> {
    try {
      const profile = await this.getProfile(userId);
      return profile?.learning_preferences || {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  async recordQuestionHistory(historyEntry: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: historyEntry.user_id,
          subject: historyEntry.subject,
          skill_area: historyEntry.skill_area,
          difficulty_level: historyEntry.difficulty_level,
          start_time: new Date().toISOString(),
          time_spent: historyEntry.response_time_seconds || 0,
          score: historyEntry.is_correct ? 100 : 0,
          completed: true,
          user_feedback: {
            question_text: historyEntry.question_text,
            user_answer: historyEntry.user_answer,
            correct_answer: historyEntry.correct_answer,
            is_correct: historyEntry.is_correct,
            struggle_indicators: historyEntry.struggle_indicators,
            mastery_indicators: historyEntry.mastery_indicators
          }
        });

      if (error) {
        console.error('Error recording question history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordQuestionHistory:', error);
      return false;
    }
  }

  async analyzeAndUpdateProfile(userId: string, subject: string, skillArea: string, questionData: any, responseData: any): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return;

      // Simple analysis - adjust difficulty based on performance
      const isCorrect = responseData.is_correct;
      let difficultyAdjustment = 0;

      if (isCorrect) {
        difficultyAdjustment = 0.1;
      } else {
        difficultyAdjustment = -0.1;
      }

      const newDifficulty = Math.max(1, Math.min(5, profile.current_difficulty_level + difficultyAdjustment));

      await this.updateProfile(userId, {
        current_difficulty_level: newDifficulty,
        last_updated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error analyzing and updating profile:', error);
    }
  }

  async getLearningProfile(userId: string, subject: string, skillArea: string): Promise<any> {
    return this.getProfile(userId);
  }

  async createOrUpdateProfile(profileData: any): Promise<boolean> {
    return this.updateProfile(profileData.user_id, profileData);
  }
}

export const userLearningProfileService = new UserLearningProfileService();
