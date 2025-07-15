import { StudentProfile } from '../types/studentProfile';
import { supabase } from '../integrations/supabase/client';

class StudentProfileService {
  public async getProfile(id: string): Promise<StudentProfile | null> {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    return data;
  }

  public async createProfile(profile: StudentProfile): Promise<void> {
    const { error } = await supabase.from('student_profiles').insert([profile]);
    if (error) {
      console.error('Error creating profile:', error);
    }
  }

  public async updateProfile(profile: StudentProfile): Promise<void> {
    const { error } = await supabase
      .from('student_profiles')
      .update(profile)
      .eq('id', profile.id);
    if (error) {
      console.error('Error updating profile:', error);
    }
  }

  public async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_profiles')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting profile:', error);
    }
  }
}

export const studentProfileService = new StudentProfileService();