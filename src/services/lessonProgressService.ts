import { supabase } from '@/integrations/supabase/client';

export interface LessonProgress {
  id?: string;
  user_id: string;
  subject: string;
  skill_area: string;
  current_activity_index: number;
  total_activities: number;
  lesson_data: unknown; // changed from 'any' to 'unknown'
  score: number;
  time_elapsed: number;
  is_completed: boolean;
}

export class LessonProgressService {
  static async saveLessonProgress(progress: Omit<LessonProgress, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert(progress, {
          onConflict: 'user_id,subject,skill_area'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving lesson progress:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in saveLessonProgress:', error);
      return null;
    }
  }

  static async getLessonProgress(userId: string, subject: string, skillArea: string): Promise<LessonProgress | null> {
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('is_completed', false)
        .maybeSingle();

      if (error) {
        console.error('Error getting lesson progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLessonProgress:', error);
      return null;
    }
  }

  static async completeLessonProgress(userId: string, subject: string, skillArea: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .update({ is_completed: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea);

      if (error) {
        console.error('Error completing lesson progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in completeLessonProgress:', error);
      return false;
    }
  }

  static async deleteLessonProgress(userId: string, subject: string, skillArea: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea);

      if (error) {
        console.error('Error deleting lesson progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteLessonProgress:', error);
      return false;
    }
  }
}
