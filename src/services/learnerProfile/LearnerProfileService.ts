import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences, InteractionEvent } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      console.log(`🔍 LearnerProfileService: Getting profile for user ${userId}`);
      
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

      // Get user preferences
      const { data: preferencesData, error: prefError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (prefError) {
        console.error('Error fetching user preferences:', prefError);
        throw prefError;
      }

      // If no profile exists, create one
      if (!profileData) {
        console.log(`🆕 Creating new learner profile for user ${userId}`);
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
      }

      // Build preferences
      const preferences: LearnerPreferences = {
        learningStyle: preferencesData?.preferred_voice === 'visual' ? 'visual' : 'mixed',
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
      
      // Create learner profile
      const { data: profileData, error: profileError } = await supabase
        .from('learner_profiles')
        .insert([{
          user_id: userId,
          overall_mastery: 0.0,
          preferences: {
            learningStyle: 'mixed',
            difficultyPreference: 0.5,
            sessionLength: 20
          },
          suggested_next_kcs: [],
          current_learning_focus_kcs: []
        }])
        .select()
        .single();

      if (profileError) {
        console.error('Error creating learner profile:', profileError);
        throw profileError;
      }

      // Create user preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .insert([{
          user_id: userId,
          preferred_voice: 'mixed',
          speech_enabled: true,
          theme: 'dark'
        }]);

      if (prefError) {
        console.error('Error creating user preferences:', prefError);
        // Don't throw - preferences are optional
      }

      const profile: LearnerProfile = {
        userId: userId,
        kcMasteryMap: {},
        preferences: {
          learningStyle: 'mixed',
          difficultyPreference: 0.5,
          sessionLength: 20
        },
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

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    try {
      console.log(`🔄 Updating KC mastery for user ${userId}, KC ${kcId}`);
      
      // Get current mastery
      const { data: currentMastery, error: fetchError } = await supabase
        .from('kc_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('kc_id', kcId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching current mastery:', fetchError);
        throw fetchError;
      }

      let newMasteryLevel: number;
      let newAttempts: number;
      let newCorrectAttempts: number;
      let newHistory: InteractionEvent[];

      if (currentMastery) {
        // Update existing mastery
        newAttempts = currentMastery.attempts + (masteryUpdate.newAttempt ? 1 : 0);
        newCorrectAttempts = currentMastery.correct_attempts + (masteryUpdate.isCorrect ? 1 : 0);
        
        // Simple mastery calculation: percentage of correct attempts
        newMasteryLevel = newAttempts > 0 ? newCorrectAttempts / newAttempts : 0;
        
        newHistory = [...(currentMastery.history || []), {
          timestamp: Date.now(),
          eventType: masteryUpdate.interactionType,
          score: masteryUpdate.isCorrect ? 1 : 0,
          details: masteryUpdate.interactionDetails
        }];
      } else {
        // Create new mastery record
        newAttempts = masteryUpdate.newAttempt ? 1 : 0;
        newCorrectAttempts = masteryUpdate.isCorrect ? 1 : 0;
        newMasteryLevel = newAttempts > 0 ? newCorrectAttempts / newAttempts : 0;
        newHistory = [{
          timestamp: Date.now(),
          eventType: masteryUpdate.interactionType,
          score: masteryUpdate.isCorrect ? 1 : 0,
          details: masteryUpdate.interactionDetails
        }];
      }

      // Update or insert mastery record
      const { error: upsertError } = await supabase
        .from('kc_mastery')
        .upsert({
          user_id: userId,
          kc_id: kcId,
          mastery_level: newMasteryLevel,
          attempts: newAttempts,
          correct_attempts: newCorrectAttempts,
          last_attempted_timestamp: new Date().toISOString(),
          history: newHistory
        });

      if (upsertError) {
        console.error('Error updating KC mastery:', upsertError);
        throw upsertError;
      }

      // Return updated profile
      const updatedProfile = await this.getProfile(userId);
      if (!updatedProfile) {
        throw new Error('Failed to retrieve updated profile');
      }

      console.log(`✅ Updated KC mastery for ${kcId}: ${newMasteryLevel}`);
      return updatedProfile;

    } catch (error) {
      console.error('Error in updateKcMastery:', error);
      throw error;
    }
  }
}

export default new LearnerProfileService();
