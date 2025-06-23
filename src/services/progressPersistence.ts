
import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  userId: string;
  subject: string;
  skillArea: string;
  accuracy: number;
  attempts: number;
  averageTime: number;
  currentLevel: number;
  engagement: number;
  learningStyle: string;
  strengths: Record<string, unknown>;
  weaknesses: Record<string, unknown>;
}

export interface AdaptiveContentRecord {
  id: string;
  subject: string;
  skillArea: string;
  gradeLevel: number;
  contentType: string;
  contentUrl: string;
  metadata: Record<string, unknown>;
}

export interface GeneratedContent {
  id: string;
  subject: string;
  skillArea: string;
  gradeLevel: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
}

export interface LearningSession {
  id?: string;
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
  user_feedback?: Record<string, unknown>;
  ai_adjustments?: Record<string, unknown>;
}

export class ProgressPersistence {
  // Use learning_sessions table instead of non-existent content_consumption table
  async logContentConsumption(userId: string, content: AdaptiveContentRecord): Promise<void> {
    try {
      console.log('📝 Logging content consumption as learning session:', { userId, content });
      
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert([
          {
            user_id: userId,
            subject: content.subject,
            skill_area: content.skillArea,
            difficulty_level: content.gradeLevel,
            start_time: new Date().toISOString(),
            time_spent: 0,
            score: 0,
            completed: false,
            content_id: content.id
          }
        ]);

      if (error) {
        console.error('Error logging content consumption:', error);
        throw error;
      }

      console.log('✅ Content consumption logged successfully');
    } catch (error) {
      console.error('Error in logContentConsumption:', error);
      throw error;
    }
  }

  // Use user_question_history table instead of non-existent question_engagement table
  async logQuestionEngagement(userId: string, question: GeneratedContent, isCorrect: boolean, responseTime: number): Promise<void> {
    try {
      console.log('❓ Logging question engagement:', { userId, question, isCorrect, responseTime });
      
      const { data, error } = await supabase
        .from('user_question_history')
        .insert([
          {
            user_id: userId,
            subject: question.subject,
            skill_area: question.skillArea,
            question_text: question.question,
            difficulty_level: question.gradeLevel,
            user_answer: '',
            correct_answer: question.options[question.correct],
            is_correct: isCorrect,
            response_time_seconds: Math.round(responseTime / 1000),
            concepts_covered: [question.skillArea]
          }
        ]);

      if (error) {
        console.error('Error logging question engagement:', error);
        throw error;
      }

      console.log('✅ Question engagement logged successfully');
    } catch (error) {
      console.error('Error in logQuestionEngagement:', error);
      throw error;
    }
  }

  async updateUserProgress(userId: string, subject: string, skillArea: string, progressData: any): Promise<void> {
    try {
      console.log('💾 Updating user progress:', { userId, subject, skillArea, progressData });
      
      const updateData = {
        user_id: userId,
        subject,
        skill_area: skillArea,
        accuracy_rate: progressData.accuracy || 0,
        attempts_count: progressData.attempts || 0,
        completion_time_avg: progressData.averageTime || 0,
        current_level: progressData.currentLevel || 1,
        engagement_score: progressData.engagement || 0,
        last_assessment: new Date().toISOString(),
        learning_style: progressData.learningStyle || 'mixed',
        strengths: (progressData.strengths || {}) as any,
        weaknesses: (progressData.weaknesses || {}) as any,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_performance')
        .upsert([updateData], { 
          onConflict: 'user_id,subject,skill_area',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error updating user progress:', error);
        throw error;
      }

      console.log('✅ Progress updated successfully');
    } catch (error) {
      console.error('Error in updateUserProgress:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string, subject: string, skillArea: string): Promise<UserProgress | null> {
    try {
      console.log('👤 Getting user progress:', { userId, subject, skillArea });
      
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (error) {
        console.error('Error getting user progress:', error);
        return null;
      }

      if (!data) {
        console.warn('No progress data found for user');
        return null;
      }

      const userProgress: UserProgress = {
        userId: data.user_id,
        subject: data.subject,
        skillArea: data.skill_area,
        accuracy: data.accuracy_rate || 0,
        attempts: data.attempts_count || 0,
        averageTime: data.completion_time_avg || 0,
        currentLevel: data.current_level || 1,
        engagement: data.engagement_score || 0,
        learningStyle: data.learning_style || 'mixed',
        strengths: (typeof data.strengths === 'object' && data.strengths !== null) ? data.strengths as Record<string, unknown> : {},
        weaknesses: (typeof data.weaknesses === 'object' && data.weaknesses !== null) ? data.weaknesses as Record<string, unknown> : {}
      };

      console.log('✅ User progress retrieved successfully');
      return userProgress;
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return null;
    }
  }

  // Add missing saveSession method
  async saveSession(sessionData: Partial<LearningSession>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: sessionData.user_id!,
          subject: sessionData.subject!,
          skill_area: sessionData.skill_area!,
          difficulty_level: sessionData.difficulty_level || 1,
          start_time: sessionData.start_time || new Date().toISOString(),
          time_spent: sessionData.time_spent || 0,
          score: sessionData.score || 0,
          completed: sessionData.completed || false,
          content_id: sessionData.content_id,
          user_feedback: (sessionData.user_feedback || {}) as any,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving session:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in saveSession:', error);
      return null;
    }
  }

  // Add missing updateSession method
  async updateSession(sessionId: string, updates: Partial<LearningSession>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_sessions')
        .update({
          end_time: updates.end_time,
          time_spent: updates.time_spent,
          score: updates.score,
          completed: updates.completed,
          user_feedback: (updates.user_feedback || {}) as any,
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSession:', error);
      return false;
    }
  }
}

export const progressPersistence = new ProgressPersistence();

// Export the hook
export { useUserProgress } from '@/hooks/useUserProgress';
