
import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';

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
            history: kc.history || []
          };
        });

        console.log(`SupabaseProfileService: Successfully loaded profile with ${Object.keys(kcMasteryMap).length} KC mastery entries`);

        // Type assertion for preferences with fallback, now reflecting the updated LearnerProfile['preferences'] type
        const defaultPrefs: Required<LearnerProfile['preferences']> = {
          learningPace: 'medium',
          learningStyle: 'mixed',
          preferredLanguage: 'en-US', // Default preferred language
          activeCurriculumContext: 'US_CCSS', // Default curriculum context
        };

        let preferences: LearnerProfile['preferences'] = defaultPrefs;
        if (existingProfileData.preferences && typeof existingProfileData.preferences === 'object' && !Array.isArray(existingProfileData.preferences)) {
          // Merge fetched preferences with defaults to ensure all keys are present
          preferences = {
            ...defaultPrefs,
            ...(existingProfileData.preferences as Partial<LearnerProfile['preferences']>),
          };
        }

        return {
          userId: existingProfileData.user_id,
          overallMastery: existingProfileData.overall_mastery || undefined,
          currentLearningFocusKcs: existingProfileData.current_learning_focus_kcs || undefined,
          suggestedNextKcs: existingProfileData.suggested_next_kcs || undefined,
          preferences,
          lastUpdatedTimestamp: new Date(existingProfileData.last_updated_timestamp).getTime(),
          kcMasteryMap,
        };

      }

      // Build preferences from profile data
      const preferences: LearnerPreferences = profileData.preferences || {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 20
      };

      const profile: LearnerProfile = {
        userId: userId,
        kcMasteryMap: kcMasteryMap,
        preferences: preferences,
        recentPerformance: [],
        overallMastery: profileData.overall_mastery || 0.0,
        lastUpdatedTimestamp: new Date(profileData.last_updated_timestamp).getTime(),
        createdAt: new Date(profileData.created_at).getTime()
      };

  private async createNewProfile(userId: string): Promise<LearnerProfile> {
    console.log(`SupabaseProfileService: Creating new profile for user ${userId}`);
    
    const defaultPreferences: Required<LearnerProfile['preferences']> = {
      learningPace: 'medium',
      learningStyle: 'mixed',
      preferredLanguage: 'en-US', // Default preferred language
      activeCurriculumContext: 'US_CCSS', // Default curriculum context
    };
    const newProfileData = {
      user_id: userId,
      preferences: defaultPreferences,
      last_updated_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('learner_profiles')
      .insert(newProfileData)
      .select()
      .single();

    if (createError) {
      console.error('SupabaseProfileService: Error creating new profile:', createError);
      throw createError;
    }
    
    console.log(`SupabaseProfileService: Successfully created new profile for user ${userId}`);
    return {
      userId: createdProfile.user_id,
      kcMasteryMap: {},
      preferences: defaultPreferences,
      lastUpdatedTimestamp: new Date(createdProfile.last_updated_timestamp).getTime(),
    };
  }

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
