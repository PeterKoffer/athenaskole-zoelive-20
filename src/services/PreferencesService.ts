
import { supabase } from '../integrations/supabase/client';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export type SubjectWeights = {
  [key in NELIESubject]?: number;
};

class PreferencesService {
  async getSchoolPreferences(schoolId: string) {
    try {
      const { data, error } = await supabase
        .from('school_preferences')
        .select('*')
        .eq('school_id', schoolId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching school preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSchoolPreferences:', error);
      return null;
    }
  }

  async updateSchoolPreferences(preferences: {
    school_id: string;
    subject_weights: SubjectWeights;
    id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('school_preferences')
        .upsert(preferences, { onConflict: 'school_id' })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating school preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateSchoolPreferences:', error);
      return null;
    }
  }

  async getTeacherPreferences(teacherId: string) {
    try {
      const { data, error } = await supabase
        .from('teacher_preferences')
        .select('*')
        .eq('teacher_id', teacherId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching teacher preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTeacherPreferences:', error);
      return null;
    }
  }

  async updateTeacherPreferences(preferences: {
    teacher_id: string;
    school_id: string;
    subject_weights: SubjectWeights;
    weekly_emphasis?: SubjectWeights;
    id?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teacher_preferences')
        .upsert(preferences, { onConflict: 'teacher_id' })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating teacher preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateTeacherPreferences:', error);
      return null;
    }
  }
}

export const preferencesService = new PreferencesService();
