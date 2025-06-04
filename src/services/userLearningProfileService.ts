
import { supabase } from '@/integrations/supabase/client';

export interface UserLearningProfile {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  learning_style: string;
  preferred_pace: string;
  attention_span_minutes: number;
  motivation_level: number;
  overall_accuracy: number;
  average_response_time: number;
  consistency_score: number;
  strengths: string[];
  weaknesses: string[];
  learning_gaps: string[];
  mastered_concepts: string[];
  total_sessions: number;
  total_time_spent: number;
  last_session_date: string;
  last_topic_covered: string;
  recommended_next_topic: string;
  current_difficulty_level: number;
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
  question_type: string;
  difficulty_level: number;
  concepts_covered: string[];
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  response_time_seconds: number;
  session_id: string;
  question_number: number;
  total_questions_in_session: number;
  struggle_indicators: any;
  mastery_indicators: any;
  asked_at: string;
}

export interface LearningRecommendation {
  id: string;
  user_id: string;
  subject: string;
  skill_area: string;
  recommendation_type: string;
  priority: number;
  content_suggestion: string;
  estimated_time_minutes: number;
  based_on: any;
  confidence_score: number;
  is_active: boolean;
  completed_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  speech_enabled: boolean;
  speech_rate: number;
  speech_pitch: number;
  preferred_voice: string;
  theme: string;
  font_size: string;
  animations_enabled: boolean;
  auto_read_questions: boolean;
  auto_read_explanations: boolean;
  session_reminders: boolean;
  created_at: string;
  updated_at: string;
}

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

  async createOrUpdateProfile(profile: Partial<UserLearningProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_learning_profiles')
        .upsert([profile], { 
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

  async recordQuestionHistory(questionData: Partial<QuestionHistoryEntry>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_question_history')
        .insert([questionData]);

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

  async createRecommendation(recommendation: Partial<LearningRecommendation>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_recommendations')
        .insert([recommendation]);

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

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert([preferences], { 
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
