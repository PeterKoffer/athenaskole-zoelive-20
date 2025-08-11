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
    if (!data) return null;

    const lsRaw = (data as any).learning_style;
    const allowed = ['mixed','visual','auditory','kinesthetic'] as const;
    const learningStyle = (allowed as readonly string[]).includes(lsRaw) ? (lsRaw as typeof allowed[number]) : 'mixed';

    const profile: StudentProfile = {
      id: data.id,
      name: (data as any).name,
      gradeLevel: (data as any).grade_level,
      learningStyle,
      interests: (data as any).interests ?? [],
      progress: ((data as any).progress as any) ?? {},
      avatarUrl: (data as any).avatar_url || undefined,
    };
    return profile;
  }

  public async createProfile(profile: StudentProfile): Promise<void> {
    const dbRow = {
      id: profile.id,
      name: profile.name,
      grade_level: profile.gradeLevel,
      learning_style: profile.learningStyle,
      interests: profile.interests,
      progress: profile.progress,
      avatar_url: profile.avatarUrl ?? null,
    };
    const { error } = await supabase.from('student_profiles').insert([dbRow]);
    if (error) {
      console.error('Error creating profile:', error);
    }
  }

  public async updateProfile(profile: StudentProfile): Promise<void> {
    const dbRow = {
      id: profile.id,
      name: profile.name,
      grade_level: profile.gradeLevel,
      learning_style: profile.learningStyle,
      interests: profile.interests,
      progress: profile.progress,
      avatar_url: profile.avatarUrl ?? null,
    };
    const { error } = await supabase
      .from('student_profiles')
      .update(dbRow)
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
