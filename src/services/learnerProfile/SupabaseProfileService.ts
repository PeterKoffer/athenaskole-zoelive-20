
import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences, KcMasteryHistoryItem } from '@/types/learnerProfile';
import type { Json } from '@/types/supabase'; // Assuming you have this type from Supabase

// Helper function to safely parse JSON fields
function safeParseJsonField<T>(jsonValue: Json | undefined | null, defaultValue: T): T {
  if (jsonValue === null || jsonValue === undefined) {
    return defaultValue;
  }
  if (typeof jsonValue === 'string') {
    try {
      const parsed = JSON.parse(jsonValue);
      // Add more specific type checks if necessary based on T
      return parsed as T;
    } catch (e) {
      console.warn('SupabaseProfileService: Failed to parse JSON string, returning default value:', jsonValue, e);
      return defaultValue;
    }
  }
  // If it's already an object/array (and not null), assume it's in the correct shape or close enough.
  // More specific validation could be added here if T is complex.
  if (typeof jsonValue === 'object') {
    return jsonValue as T;
  }
  // For other primitive types if they are directly assignable or if it's an unexpected type
  console.warn(`SupabaseProfileService: Unexpected type for JSON field, returning default. Value: ${jsonValue}`);
  return defaultValue;
}


class SupabaseProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      console.log(`🔍 SupabaseProfileService: Getting profile for user ${userId}`);
      
      // Get learner profile
      const { data: profileData, error: profileError } = await supabase
        .from('learner_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching learner profile:', profileError);
        throw profileError;
      }

      // Get KC mastery data
      const { data: kcMasteryData, error: kcError } = await supabase
        .from('kc_mastery')
        .select('*')
        .eq('user_id', userId);

      if (kcError) {
        console.error('Error fetching KC mastery:', kcError);
        throw kcError;
      }

      // If no profile exists, create one
      if (!profileData) {
        console.log(`🆕 Creating new profile for user ${userId}`);
        return await this.createInitialProfile(userId);
      }

      // Build KC mastery map
      const kcMasteryMap: Record<string, KnowledgeComponentMastery> = {};
      
      if (kcMasteryData) {
        kcMasteryData.forEach(kc => {
          kcMasteryMap[kc.kc_id] = {
            kcId: kc.kc_id,
            masteryLevel: kc.mastery_level,
            attempts: kc.attempts,
            correctAttempts: kc.correct_attempts,
            lastAttemptTimestamp: new Date(kc.last_attempted_timestamp || Date.now()).getTime(),
            history: safeParseJsonField<KcMasteryHistoryItem[]>(kc.history, [])
          };
        });
      }

      // Build preferences from profile data
      const defaultPreferences: LearnerPreferences = {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 20
      };
      const preferences: LearnerPreferences = safeParseJsonField<LearnerPreferences>(profileData.preferences, defaultPreferences);

      const profile: LearnerProfile = {
        userId: userId,
        kcMasteryMap: kcMasteryMap,
        preferences: preferences,
        recentPerformance: [],
        overallMastery: profileData.overall_mastery || 0.0,
        lastUpdatedTimestamp: new Date(profileData.last_updated_timestamp).getTime(),
        createdAt: new Date(profileData.created_at).getTime()
      };

      console.log(`✅ Retrieved profile for user ${userId} with ${Object.keys(kcMasteryMap).length} KC masteries`);
      return profile;

    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    try {
      console.log(`🆕 Creating initial profile for user ${userId}`);
      
      const initialPreferences: LearnerPreferences = {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 20
      };

      // Create learner profile
      const { data: profileData, error: profileError } = await supabase
        .from('learner_profiles')
        .insert([{
          user_id: userId,
          overall_mastery: 0.0,
          preferences: initialPreferences,
          suggested_next_kcs: [],
          current_learning_focus_kcs: []
        }])
        .select()
        .single();

      if (profileError) {
        console.error('Error creating learner profile:', profileError);
        throw profileError;
      }

      const profile: LearnerProfile = {
        userId: userId,
        kcMasteryMap: {},
        preferences: initialPreferences,
        recentPerformance: [],
        overallMastery: 0.0,
        lastUpdatedTimestamp: new Date(profileData.last_updated_timestamp).getTime(),
        createdAt: new Date(profileData.created_at).getTime()
      };

      console.log(`✅ Created initial profile for user ${userId}`);
      return profile;

    } catch (error) {
      console.error('Error in createInitialProfile:', error);
      throw error;
    }
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    try {
      console.log(`🔄 Updating profile for user ${profile.userId}`);
      
      // Update learner profile
      const { error: profileError } = await supabase
        .from('learner_profiles')
        .update({
          overall_mastery: profile.overallMastery,
          preferences: profile.preferences,
          last_updated_timestamp: new Date().toISOString()
        })
        .eq('user_id', profile.userId);

      if (profileError) {
        console.error('Error updating learner profile:', profileError);
        throw profileError;
      }

      // Update KC mastery data
      for (const [kcId, mastery] of Object.entries(profile.kcMasteryMap)) {
        const { error: kcError } = await supabase
          .from('kc_mastery')
          .upsert({
            user_id: profile.userId,
            kc_id: kcId,
            mastery_level: mastery.masteryLevel,
            attempts: mastery.attempts,
            correct_attempts: mastery.correctAttempts,
            last_attempted_timestamp: new Date(mastery.lastAttemptTimestamp).toISOString(),
            history: mastery.history
          });

        if (kcError) {
          console.error(`Error updating KC mastery for ${kcId}:`, kcError);
          // Continue with other KCs
        }
      }

      console.log(`✅ Updated profile for user ${profile.userId}`);

    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
}

export default new SupabaseProfileService();
