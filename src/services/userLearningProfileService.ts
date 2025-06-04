
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

// Export interfaces that match the database schema
export interface UserLearningProfile extends UserLearningProfileRow {}
export interface QuestionHistoryEntry extends UserQuestionHistoryRow {}
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

      return data || null;
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

      return data || [];
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
