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

export class ProgressPersistence {
  async logContentConsumption(userId: string, content: AdaptiveContentRecord): Promise<void> {
    try {
      console.log('📝 Logging content consumption:', { userId, content });
      
      const { data, error } = await supabase
        .from('content_consumption')
        .insert([
          {
            user_id: userId,
            content_id: content.id,
            subject: content.subject,
            skill_area: content.skillArea,
            grade_level: content.gradeLevel,
            content_type: content.contentType,
            content_url: content.contentUrl,
            metadata: content.metadata
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

  async logQuestionEngagement(userId: string, question: GeneratedContent, isCorrect: boolean, responseTime: number): Promise<void> {
    try {
      console.log('❓ Logging question engagement:', { userId, question, isCorrect, responseTime });
      
      const { data, error } = await supabase
        .from('question_engagement')
        .insert([
          {
            user_id: userId,
            question_id: question.id,
            subject: question.subject,
            skill_area: question.skillArea,
            grade_level: question.gradeLevel,
            is_correct: isCorrect,
            response_time: responseTime,
            learning_objectives: question.learningObjectives
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
        strengths: progressData.strengths || [] as any, // Cast to any for Json compatibility
        weaknesses: progressData.weaknesses || [] as any, // Cast to any for Json compatibility
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
        strengths: data.strengths || {},
        weaknesses: data.weaknesses || {}
      };

      console.log('✅ User progress retrieved successfully');
      return userProgress;
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return null;
    }
  }
}

export const progressPersistence = new ProgressPersistence();
