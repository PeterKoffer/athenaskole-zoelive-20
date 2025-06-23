
import { supabase } from '@/integrations/supabase/client';

export interface UserLearningProfile {
  id?: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_difficulty_level: number;
  overall_accuracy: number;
  strengths: string[];
  weaknesses: string[];
  learning_style: string;
  total_sessions: number;
  total_time_spent: number;
  last_session_date: string | null;
  last_topic_covered: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id: string;
  auto_read_enabled: boolean;
  voice_speed: number;
  difficulty_preference: string;
  learning_style: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionHistoryEntry {
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
  session_id?: string;
  question_number: number;
  total_questions_in_session: number;
  struggle_indicators: Record<string, unknown>;
  mastery_indicators: Record<string, unknown>;
}

class UserLearningProfileService {
  async getLearningProfile(userId: string, subject: string, skillArea?: string): Promise<UserLearningProfile | null> {
    try {
      let query = supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject);

      if (skillArea) {
        query = query.eq('skill_area', skillArea);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching learning profile:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        subject: data.subject,
        skill_area: data.skill_area,
        current_difficulty_level: data.current_level || 1,
        overall_accuracy: data.accuracy_rate || 0,
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
        learning_style: data.learning_style || 'mixed',
        total_sessions: data.attempts_count || 0,
        total_time_spent: data.completion_time_avg || 0,
        last_session_date: data.last_assessment,
        last_topic_covered: data.skill_area,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error in getLearningProfile:', error);
      return null;
    }
  }

  async createOrUpdateProfile(profileData: Partial<UserLearningProfile>): Promise<boolean> {
    try {
      const dbData = {
        user_id: profileData.user_id!,
        subject: profileData.subject!,
        skill_area: profileData.skill_area || 'general',
        current_level: profileData.current_difficulty_level || 1,
        accuracy_rate: profileData.overall_accuracy || 0,
        strengths: profileData.strengths || [],
        weaknesses: profileData.weaknesses || [],
        learning_style: profileData.learning_style || 'mixed',
        attempts_count: profileData.total_sessions || 0,
        completion_time_avg: profileData.total_time_spent || 0,
        last_assessment: profileData.last_session_date,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_performance')
        .upsert([dbData], { 
          onConflict: 'user_id,subject,skill_area',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
      return false;
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Since we don't have a preferences table, return default preferences
      return {
        user_id: userId,
        auto_read_enabled: true,
        voice_speed: 1.0,
        difficulty_preference: 'adaptive',
        learning_style: 'mixed'
      };
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return null;
    }
  }

  async recordQuestionHistory(historyEntry: QuestionHistoryEntry): Promise<boolean> {
    try {
      // For now, just log the history entry since we don't have a question_history table
      console.log('📝 Question history recorded:', historyEntry);
      return true;
    } catch (error) {
      console.error('Error recording question history:', error);
      return false;
    }
  }

  async analyzeAndUpdateProfile(
    userId: string, 
    subject: string, 
    skillArea: string, 
    questionData: any, 
    response: any
  ): Promise<boolean> {
    try {
      console.log('📊 Analyzing and updating profile for user:', userId);
      return true;
    } catch (error) {
      console.error('Error analyzing profile:', error);
      return false;
    }
  }
}

export const userLearningProfileService = new UserLearningProfileService();
