
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use the actual database types
type UserLearningProfileRow = Database['public']['Tables']['user_learning_profiles']['Row'];
type UserLearningProfileInsert = Database['public']['Tables']['user_learning_profiles']['Insert'];
type UserQuestionHistoryRow = Database['public']['Tables']['user_question_history']['Row'];
type UserQuestionHistoryInsert = Database['public']['Tables']['user_question_history']['Insert'];
type LearningRecommendationRow = Database['public']['Tables']['learning_recommendations']['Row'];
type LearningRecommendationInsert = Database['public']['Tables']['learning_recommendations']['Insert'];
type UserPreferencesRow = Database['public']['Tables']['user_preferences']['Row'];
type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];

// Export interfaces that match the database schema but with proper array types for app use
export interface UserLearningProfile {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  learning_style: string | null;
  preferred_pace: string | null;
  attention_span_minutes: number | null;
  motivation_level: number | null;
  overall_accuracy: number | null;
  average_response_time: number | null;
  consistency_score: number | null;
  strengths: string[];
  weaknesses: string[];
  learning_gaps: string[];
  mastered_concepts: string[];
  total_sessions: number | null;
  total_time_spent: number | null;
  last_session_date: string | null;
  last_topic_covered: string | null;
  recommended_next_topic: string | null;
  current_difficulty_level: number | null;
  difficulty_adjustments: any[];
  created_at: string;
  updated_at: string;
}

export interface QuestionHistoryEntry {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  question_text: string;
  question_type: string | null;
  difficulty_level: number;
  concepts_covered: string[];
  user_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  response_time_seconds: number | null;
  session_id: string | null;
  question_number: number | null;
  total_questions_in_session: number | null;
  struggle_indicators: any;
  mastery_indicators: any;
  asked_at: string;
}

export interface LearningRecommendation extends LearningRecommendationRow {}
export interface UserPreferences extends UserPreferencesRow {}

class UserLearningProfileService {
  async getLearningProfile(userId: string, subject: string, skillArea: string): Promise<UserLearningProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_learning_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching learning profile:', error);
        return null;
      }

      if (!data) return null;

      // Transform JSONB arrays to string arrays
      return {
        ...data,
        strengths: Array.isArray(data.strengths) ? data.strengths as string[] : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses as string[] : [],
        learning_gaps: Array.isArray(data.learning_gaps) ? data.learning_gaps as string[] : [],
        mastered_concepts: Array.isArray(data.mastered_concepts) ? data.mastered_concepts as string[] : [],
        difficulty_adjustments: Array.isArray(data.difficulty_adjustments) ? data.difficulty_adjustments : [],
      };
    } catch (error) {
      console.error('Error in getLearningProfile:', error);
      return null;
    }
  }

  async createOrUpdateProfile(profile: UserLearningProfileInsert): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_learning_profiles')
        .upsert(profile, { 
          onConflict: 'user_id,subject,skill_area',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating learning profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      return false;
    }
  }

  async recordQuestionHistory(questionData: UserQuestionHistoryInsert): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_question_history')
        .insert(questionData);

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

  async getQuestionHistory(userId: string, subject: string, skillArea: string, limit: number = 50): Promise<QuestionHistoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from('user_question_history')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .order('asked_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching question history:', error);
        return [];
      }

      if (!data) return [];

      // Transform JSONB arrays to string arrays
      return data.map(item => ({
        ...item,
        concepts_covered: Array.isArray(item.concepts_covered) ? item.concepts_covered as string[] : [],
        struggle_indicators: item.struggle_indicators || {},
        mastery_indicators: item.mastery_indicators || {},
      }));
    } catch (error) {
      console.error('Error in getQuestionHistory:', error);
      return [];
    }
  }

  async createRecommendation(recommendation: LearningRecommendationInsert): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_recommendations')
        .insert(recommendation);

      if (error) {
        console.error('Error creating recommendation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createRecommendation:', error);
      return false;
    }
  }

  async getActiveRecommendations(userId: string, subject?: string): Promise<LearningRecommendation[]> {
    try {
      let query = supabase
        .from('learning_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (subject) {
        query = query.eq('subject', subject);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveRecommendations:', error);
      return [];
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return null;
    }
  }

  async updateUserPreferences(preferences: UserPreferencesInsert): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating user preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserPreferences:', error);
      return false;
    }
  }

  async analyzeAndUpdateProfile(
    userId: string, 
    subject: string, 
    skillArea: string, 
    questionData: any, 
    userResponse: any
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('analyze_and_update_learning_profile', {
        p_user_id: userId,
        p_subject: subject,
        p_skill_area: skillArea,
        p_question_data: questionData,
        p_user_response: userResponse
      });

      if (error) {
        console.error('Error analyzing and updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in analyzeAndUpdateProfile:', error);
      return false;
    }
  }
}

export const userLearningProfileService = new UserLearningProfileService();
