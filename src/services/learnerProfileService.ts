// src/services/learnerProfileService.ts

import {
  LearnerProfile,
  KcMastery,
  ILearnerProfileService,
} from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import knowledgeComponentService from './knowledgeComponentService'; // To get KC details
// import stealthAssessmentService from './stealthAssessmentService'; // Not directly used here for logging profile changes yet
// import { InteractionEventType } from '@/types/stealthAssessment'; // Not directly used here
import { supabase } from '@/integrations/supabase/client';

// TODO: Replace with actual user ID from Supabase auth context (e.g., supabase.auth.getUser())
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
   if (user) {
    return user.id;
  }
  console.warn('LearnerProfileService: No authenticated user found. Operations will likely fail or use mocks if not handled by caller.');
  return null; // Indicate no user
};


class LearnerProfileService implements ILearnerProfileService {
  
  private async fetchOrCreateProfileFromSupabase(userId: string): Promise<LearnerProfile> {
    const { data: existingProfileData, error: fetchError } = await supabase
      .from('learner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: "Searched for a single row, but found no rows"
      console.error('LearnerProfileService: Error fetching profile:', fetchError);
      throw fetchError;
    }

    if (existingProfileData) {
      // Fetch associated kc_mastery records
      const { data: kcMasteryData, error: kcsError } = await supabase
        .from('kc_mastery')
        .select('*')
        .eq('user_id', userId);

      if (kcsError) {
        console.error('LearnerProfileService: Error fetching KC mastery data:', kcsError);
        throw kcsError;
      }
      
      const kcMasteryMap: Record<string, KcMastery> = {};
      kcMasteryData?.forEach(km => {
        kcMasteryMap[km.kc_id] = {
          kcId: km.kc_id,
          masteryLevel: km.mastery_level,
          attempts: km.attempts,
          correctAttempts: km.correct_attempts,
          lastAttemptedTimestamp: km.last_attempted_timestamp ? new Date(km.last_attempted_timestamp).getTime() : undefined,
          history: km.history || [],
        };
      });

      return {
        userId: existingProfileData.user_id,
        overallMastery: existingProfileData.overall_mastery || undefined,
        currentLearningFocusKcs: existingProfileData.current_learning_focus_kcs || undefined,
        suggestedNextKcs: existingProfileData.suggested_next_kcs || undefined,
        preferences: existingProfileData.preferences || { learningPace: 'medium', learningStyle: 'mixed' },
        lastUpdatedTimestamp: new Date(existingProfileData.last_updated_timestamp).getTime(),
        kcMasteryMap,
      };
    }

    // Create a new profile if one doesn't exist
    const newProfileData = {
      user_id: userId,
      preferences: { learningPace: 'medium', learningStyle: 'mixed' },
      last_updated_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    const { data: createdProfile, error: createError } = await supabase
      .from('learner_profiles')
      .insert(newProfileData)
      .select()
      .single();

    if (createError) {
      console.error('LearnerProfileService: Error creating new profile:', createError);
      throw createError;
    }
    
    console.log(`LearnerProfileService: Initialized new profile for user ${userId} in Supabase.`);
    return {
      userId: createdProfile.user_id,
      kcMasteryMap: {},
      preferences: createdProfile.preferences || { learningPace: 'medium', learningStyle: 'mixed' },
      lastUpdatedTimestamp: new Date(createdProfile.last_updated_timestamp).getTime(),
    };
  }

  async getProfile(userId: string): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to get a profile.");
    return this.fetchOrCreateProfileFromSupabase(userId);
  }

  async updateKcMastery(
    userId: string,
    kcId: string,
    eventDetails: {
      isCorrect?: boolean;
      newAttempt?: boolean;
      score?: number;
      interactionType: string;
      interactionDetails?: any;
    }
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to update KC mastery.");

    const profile = await this.getProfile(userId); // Ensures profile exists and kcMasteryMap is populated
    let kcMastery = profile.kcMasteryMap[kcId];

    const currentTimestamp = Date.now();
    const currentISOTimestamp = new Date(currentTimestamp).toISOString();

    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.0,
        attempts: 0,
        correctAttempts: 0,
        history: [],
      };
    }

    if (eventDetails.newAttempt) {
      kcMastery.attempts += 1;
    }

    if (eventDetails.isCorrect !== undefined) {
      if (eventDetails.isCorrect) {
        kcMastery.correctAttempts += 1;
        kcMastery.masteryLevel = Math.min(1.0, kcMastery.masteryLevel + 0.1);
      } else {
        kcMastery.masteryLevel = Math.max(0.0, kcMastery.masteryLevel - 0.05);
      }
    } else if (eventDetails.score !== undefined) {
      kcMastery.masteryLevel = Math.max(0.0, Math.min(1.0,
        (kcMastery.masteryLevel * (kcMastery.attempts - (eventDetails.newAttempt ? 1: 0)) + eventDetails.score) / (kcMastery.attempts || 1)
      ));
    }
    kcMastery.masteryLevel = Math.max(0.0, Math.min(1.0, kcMastery.masteryLevel));
    kcMastery.lastAttemptedTimestamp = currentTimestamp;
    
    kcMastery.history = kcMastery.history || [];
    kcMastery.history.unshift({
      timestamp: currentTimestamp,
      eventType: eventDetails.interactionType,
      score: eventDetails.score,
      details: eventDetails.interactionDetails,
    });
    if (kcMastery.history.length > 10) kcMastery.history.pop();

    // Upsert to Supabase kc_mastery table
    const { error: upsertError } = await supabase
      .from('kc_mastery')
      .upsert({
        user_id: userId,
        kc_id: kcId,
        mastery_level: kcMastery.masteryLevel,
        attempts: kcMastery.attempts,
        correct_attempts: kcMastery.correctAttempts,
        last_attempted_timestamp: currentISOTimestamp,
        history: kcMastery.history,
        last_updated_timestamp: currentISOTimestamp,
      }, { onConflict: 'user_id, kc_id' });

    if (upsertError) {
      console.error(`LearnerProfileService: Error upserting KC mastery for ${kcId}:`, upsertError);
      throw upsertError;
    }

    // Update profile's lastUpdatedTimestamp
    await supabase
      .from('learner_profiles')
      .update({ last_updated_timestamp: currentISOTimestamp })
      .eq('user_id', userId);
      
    profile.kcMasteryMap[kcId] = kcMastery;
    profile.lastUpdatedTimestamp = currentTimestamp;
    
    console.log(`LearnerProfileService: Updated KC mastery in Supabase for user ${userId}, KC ${kcId}`);
    return profile;
  }

  async batchUpdateKcMastery(
     userId: string,
    updates: Array<{
      kcId: string;
      eventDetails: {
        isCorrect?: boolean;
        newAttempt?: boolean;
        score?: number;
        interactionType: string;
        interactionDetails?: any;
      };
    }>
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required for batch update.");
    // For simplicity, we'll call updateKcMastery repeatedly.
    // A more optimized batch update would construct a single Supabase query if possible,
    // or use a transaction/stored procedure.
    let profile = await this.getProfile(userId);
    for (const update of updates) {
      profile = await this.updateKcMastery(userId, update.kcId, update.eventDetails);
    }
    return profile;
  }

  async getKcMastery(userId: string, kcId: string): Promise<KcMastery | undefined> {
    if (!userId) throw new Error("User ID is required to get KC mastery.");
    const { data, error } = await supabase
      .from('kc_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('kc_id', kcId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('LearnerProfileService: Error fetching single KC mastery:', error);
      throw error;
    }
    if (!data) return undefined;

    return {
      kcId: data.kc_id,
      masteryLevel: data.mastery_level,
      attempts: data.attempts,
      correctAttempts: data.correct_attempts,
      lastAttemptedTimestamp: data.last_attempted_timestamp ? new Date(data.last_attempted_timestamp).getTime() : undefined,
      history: data.history || [],
    };
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to update preferences.");
    const currentISOTimestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('learner_profiles')
      .update({ preferences, last_updated_timestamp: currentISOTimestamp })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('LearnerProfileService: Error updating preferences:', error);
      throw error;
    }
    if (!data) throw new Error("Profile not found for preference update.");

    console.log(`LearnerProfileService: Updated preferences in Supabase for user ${userId}`);
    // Refetch the full profile to return consistent data including KCs
    return this.getProfile(userId);
  }

  async recommendNextKcs(userId: string, count: number = 3): Promise<KnowledgeComponent[]> {
    if (!userId) throw new Error("User ID is required for recommendations.");
    const profile = await this.getProfile(userId);
    
    const allKcs = await knowledgeComponentService.searchKcs(''); 
    
    const potentialKcs = allKcs.filter(kc => {
      const mastery = profile.kcMasteryMap[kc.id];
      if (!mastery) return true; 
      return mastery.masteryLevel < 0.8; 
    });

    potentialKcs.sort((a, b) => {
      const masteryA = profile.kcMasteryMap[a.id]?.masteryLevel || 0;
      const masteryB = profile.kcMasteryMap[b.id]?.masteryLevel || 0;
      const attemptsA = profile.kcMasteryMap[a.id]?.attempts || 0;
      const attemptsB = profile.kcMasteryMap[b.id]?.attempts || 0;

      if (attemptsA > 0 && masteryA < 0.8 && (attemptsB === 0 || masteryB >= 0.8)) return -1;
      if (attemptsB > 0 && masteryB < 0.8 && (attemptsA === 0 || masteryA >= 0.8)) return 1;
      
      return (a.difficultyEstimate || 0) - (b.difficultyEstimate || 0);
    });

    console.log(`LearnerProfileService: Recommended next KCs for user ${userId}:`, potentialKcs.slice(0, count).map(kc=>kc.id));
    return potentialKcs.slice(0, count);
  }
}

// Export a singleton instance
const learnerProfileService = new LearnerProfileService();
export default learnerProfileService;
