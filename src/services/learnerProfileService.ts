
import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      console.log(`📊 Loading learner profile for user: ${userId}`);
      
      // Try to get existing profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('learner_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Error fetching learner profile:', profileError);
        throw profileError;
      }

      if (profileData) {
        console.log('✅ Found existing learner profile');
        return this.mapDbToProfile(profileData);
      }

      // Create new profile if none exists
      console.log('🆕 Creating new learner profile');
      return await this.createDefaultProfile(userId);

    } catch (error) {
      console.error('💥 Error in getProfile:', error);
      return this.createFallbackProfile(userId);
    }
  }

  private async createDefaultProfile(userId: string): Promise<LearnerProfile> {
    const defaultProfile: LearnerProfile = {
      userId,
      kcMasteryMap: {},
      preferences: {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 15
      },
      recentPerformance: [],
      overallMastery: 0.0,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now()
    };

    try {
      const { error } = await supabase
        .from('learner_profiles')
        .insert({
          user_id: userId,
          overall_mastery: 0.0,
          preferences: defaultProfile.preferences,
          suggested_next_kcs: [],
          current_learning_focus_kcs: []
        });

      if (error) {
        console.warn('⚠️ Could not save profile to DB, using in-memory profile:', error);
      }
    } catch (error) {
      console.warn('⚠️ Error saving profile to DB:', error);
    }

    return defaultProfile;
  }

  private createFallbackProfile(userId: string): LearnerProfile {
    return {
      userId,
      kcMasteryMap: {},
      preferences: {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 15
      },
      recentPerformance: [],
      overallMastery: 0.0,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now()
    };
  }

  private mapDbToProfile(dbData: any): LearnerProfile {
    return {
      userId: dbData.user_id,
      kcMasteryMap: {},
      preferences: dbData.preferences || {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 15
      },
      recentPerformance: [],
      overallMastery: dbData.overall_mastery || 0.0,
      lastUpdatedTimestamp: new Date(dbData.last_updated_timestamp).getTime(),
      createdAt: new Date(dbData.created_at).getTime()
    };
  }
}

export default new LearnerProfileService();
