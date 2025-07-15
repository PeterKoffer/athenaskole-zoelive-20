
import { supabase } from '@/integrations/supabase/client';
import { StudentProfile } from '@/types/studentProfile';

export class SupabaseStudentProfileService {
  async getProfile(userId: string): Promise<StudentProfile | null> {
    try {
      console.log('📊 Getting student profile for user:', userId);
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          console.log('ℹ️ No student profile found for user');
          return null;
        }
        throw error;
      }

      console.log('✅ Student profile retrieved successfully');
      return {
        id: data.id,
        name: data.name,
        gradeLevel: data.grade_level,
        learningStyle: data.learning_style as 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
        interests: data.interests || [],
        progress: data.progress || {}
      };
    } catch (error) {
      console.error('❌ Error getting student profile:', error);
      return null;
    }
  }

  async createProfile(userId: string, profile: Omit<StudentProfile, 'id'>): Promise<StudentProfile | null> {
    try {
      console.log('📊 Creating student profile for user:', userId);
      
      const { data, error } = await supabase
        .from('student_profiles')
        .insert({
          user_id: userId,
          name: profile.name,
          grade_level: profile.gradeLevel,
          learning_style: profile.learningStyle,
          interests: profile.interests,
          progress: profile.progress
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Student profile created successfully');
      return {
        id: data.id,
        name: data.name,
        gradeLevel: data.grade_level,
        learningStyle: data.learning_style as 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
        interests: data.interests || [],
        progress: data.progress || {}
      };
    } catch (error) {
      console.error('❌ Error creating student profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<Omit<StudentProfile, 'id'>>): Promise<StudentProfile | null> {
    try {
      console.log('📊 Updating student profile for user:', userId);
      
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.gradeLevel !== undefined) updateData.grade_level = updates.gradeLevel;
      if (updates.learningStyle !== undefined) updateData.learning_style = updates.learningStyle;
      if (updates.interests !== undefined) updateData.interests = updates.interests;
      if (updates.progress !== undefined) updateData.progress = updates.progress;

      const { data, error } = await supabase
        .from('student_profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Student profile updated successfully');
      return {
        id: data.id,
        name: data.name,
        gradeLevel: data.grade_level,
        learningStyle: data.learning_style as 'mixed' | 'visual' | 'auditory' | 'kinesthetic',
        interests: data.interests || [],
        progress: data.progress || {}
      };
    } catch (error) {
      console.error('❌ Error updating student profile:', error);
      return null;
    }
  }

  async deleteProfile(userId: string): Promise<boolean> {
    try {
      console.log('📊 Deleting student profile for user:', userId);
      
      const { error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      console.log('✅ Student profile deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting student profile:', error);
      return false;
    }
  }
}

export const supabaseStudentProfileService = new SupabaseStudentProfileService();
