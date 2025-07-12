import { supabase } from '../integrations/supabase/client';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export type SubjectWeights = {
  [key in NELIESubject]?: number;
};

export interface SchoolPreferences {
  id?: string;
  school_id: string;
  subject_weights: SubjectWeights;
}

export interface TeacherPreferences extends SchoolPreferences {
  teacher_id: string;
  weekly_emphasis?: SubjectWeights;
}

class PreferencesService {
  async getSchoolPreferences(schoolId: string): Promise<SchoolPreferences | null> {
    const { data, error } = await supabase
      .from('school_preferences')
      .select('*')
      .eq('school_id', schoolId)
      .single();

    if (error) {
      console.error('Error fetching school preferences:', error);
      return null;
    }

    return data;
  }

  async updateSchoolPreferences(preferences: SchoolPreferences): Promise<SchoolPreferences | null> {
    const { data, error } = await supabase
      .from('school_preferences')
      .upsert(preferences, { onConflict: 'school_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating school preferences:', error);
      return null;
    }

    return data;
  }

  async getTeacherPreferences(teacherId: string): Promise<TeacherPreferences | null> {
    const { data, error } = await supabase
      .from('teacher_preferences')
      .select('*')
      .eq('teacher_id', teacherId)
      .single();

    if (error) {
      console.error('Error fetching teacher preferences:', error);
      return null;
    }

    return data;
  }

  async updateTeacherPreferences(preferences: TeacherPreferences): Promise<TeacherPreferences | null> {
    const { data, error } = await supabase
      .from('teacher_preferences')
      .upsert(preferences, { onConflict: 'teacher_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating teacher preferences:', error);
      return null;
    }

    return data;
  }
}

export const preferencesService = new PreferencesService();
