/* @ts-nocheck */
// Repository for basic profile operations
import { supabase } from '@/integrations/supabase/client';
import type { LearnerPreferences, LearnerProfile } from '@/types/learnerProfile';

export class SupabaseProfileRepository {
  static async createLearnerProfile(userId: string, preferences: LearnerPreferences): Promise<boolean> {
    try {
      console.log('🆕 Creating learner profile for user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          overall_mastery: 0.0,
          preferences: preferences as any,
          recent_performance: [] as any
        })
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error creating learner profile:', error);
        return false;
      }

      console.log('✅ Learner profile created successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception creating learner profile:', error);
      return false;
    }
  }

  static async updateLearnerProfile(userId: string, updates: Partial<LearnerProfile>): Promise<boolean> {
    try {
      console.log('📝 Updating learner profile for user:', userId);
      
      const profileUpdates: any = {};
      
      if (updates.preferences) profileUpdates.preferences = updates.preferences;
      if (updates.overallMastery !== undefined) profileUpdates.overall_mastery = updates.overallMastery;
      if (updates.recentPerformance) profileUpdates.recent_performance = updates.recentPerformance;

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error updating learner profile:', error);
        return false;
      }

      console.log('✅ Learner profile updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception updating learner profile:', error);
      return false;
    }
  }

  static async getProfileData(userId: string) {
    console.log('👤 Getting profile data for user:', userId);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error fetching profile:', profileError);
      return null;
    }

    return profileData;
  }

  static async recordLearningInteraction(userId: string, interactionData: any): Promise<boolean> {
    try {
      console.log('📝 Recording learning interaction for user:', userId);
      
      // Update recent performance if provided
      if (interactionData.performance !== undefined) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('recent_performance')
          .eq('user_id', userId)
          .single();

        const recentPerformance = (profile?.recent_performance as any[]) || [];
        const updatedPerformance = [...recentPerformance, interactionData.performance].slice(-10); // Keep last 10

        await supabase
          .from('profiles')
          .update({ recent_performance: updatedPerformance })
          .eq('user_id', userId);
      }

      console.log('✅ Learning interaction recorded successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception recording learning interaction:', error);
      return false;
    }
  }
}