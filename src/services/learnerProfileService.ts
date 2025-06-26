
// src/services/learnerProfileService.ts

import {
  LearnerProfile,
  KcMastery,
  ILearnerProfileService,
} from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import knowledgeComponentService from './knowledgeComponentService';
import { supabase } from '@/integrations/supabase/client';

const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
   if (user) {
    return user.id;
  }
  console.warn('LearnerProfileService: No authenticated user found. Operations will likely fail or use mocks if not handled by caller.');
  return null;
};

// Mock user for testing - matches the one used in AdaptivePracticeModule
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

class LearnerProfileService implements ILearnerProfileService {
  
  private async createMockProfile(userId: string): Promise<LearnerProfile> {
    console.log(`LearnerProfileService: Creating mock profile for testing user ${userId}`);
    
    const mockProfile: LearnerProfile = {
      userId: userId,
      kcMasteryMap: {
        'kc_math_g4_add_fractions_likedenom': {
          kcId: 'kc_math_g4_add_fractions_likedenom',
          masteryLevel: 0.3,
          attempts: 2,
          correctAttempts: 1,
          lastAttemptedTimestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
          history: [
            {
              timestamp: Date.now() - 24 * 60 * 60 * 1000,
              eventType: 'QUESTION_ATTEMPT',
              score: 0.5,
              details: { isCorrect: true }
            }
          ]
        },
        'kc_math_g4_subtract_fractions_likedenom': {
          kcId: 'kc_math_g4_subtract_fractions_likedenom',
          masteryLevel: 0.1,
          attempts: 1,
          correctAttempts: 0,
          lastAttemptedTimestamp: Date.now() - 48 * 60 * 60 * 1000, // 2 days ago
          history: [
            {
              timestamp: Date.now() - 48 * 60 * 60 * 1000,
              eventType: 'QUESTION_ATTEMPT',
              score: 0.0,
              details: { isCorrect: false }
            }
          ]
        }
      },
      preferences: {
        learningPace: 'medium',
        learningStyle: 'visual'
      },
      lastUpdatedTimestamp: Date.now(),
      overallMastery: 0.2,
      currentLearningFocusKcs: ['kc_math_g4_add_fractions_likedenom'],
      suggestedNextKcs: ['kc_math_g5_multiply_decimals']
    };

    return mockProfile;
  }

  private async fetchOrCreateProfileFromSupabase(userId: string): Promise<LearnerProfile> {
    // Check if this is our mock user for testing
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Using mock profile for testing');
      return this.createMockProfile(userId);
    }

    const { data: existingProfileData, error: fetchError } = await supabase
      .from('learner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('LearnerProfileService: Error fetching profile:', fetchError);
      throw fetchError;
    }

    if (existingProfileData) {
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
          history: Array.isArray(km.history) ? km.history as Array<{timestamp: number; eventType: string; score?: number; details?: any}> : [],
        };
      });

      // Type assertion for preferences with fallback
      const preferences = (existingProfileData.preferences && typeof existingProfileData.preferences === 'object' && !Array.isArray(existingProfileData.preferences)) 
        ? existingProfileData.preferences as { learningPace?: 'medium' | 'slow' | 'fast'; learningStyle?: 'mixed' | 'visual' | 'kinesthetic' | 'auditory' }
        : { learningPace: 'medium' as const, learningStyle: 'mixed' as const };

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

    // Create a new profile if one doesn't exist
    const defaultPreferences = { learningPace: 'medium' as const, learningStyle: 'mixed' as const };
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
      console.error('LearnerProfileService: Error creating new profile:', createError);
      throw createError;
    }
    
    console.log(`LearnerProfileService: Initialized new profile for user ${userId} in Supabase.`);
    return {
      userId: createdProfile.user_id,
      kcMasteryMap: {},
      preferences: defaultPreferences,
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

    // For mock user, just return updated mock profile
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Mock KC mastery update for testing');
      const profile = await this.getProfile(userId);
      
      // Update the mock profile with new mastery data
      let kcMastery = profile.kcMasteryMap[kcId];
      if (!kcMastery) {
        kcMastery = {
          kcId,
          masteryLevel: eventDetails.isCorrect ? 0.3 : 0.1,
          attempts: 1,
          correctAttempts: eventDetails.isCorrect ? 1 : 0,
          history: []
        };
      } else {
        if (eventDetails.newAttempt) {
          kcMastery.attempts += 1;
        }
        if (eventDetails.isCorrect) {
          kcMastery.correctAttempts += 1;
          kcMastery.masteryLevel = Math.min(1.0, kcMastery.masteryLevel + 0.1);
        } else {
          kcMastery.masteryLevel = Math.max(0.0, kcMastery.masteryLevel - 0.05);
        }
      }
      
      kcMastery.lastAttemptedTimestamp = Date.now();
      kcMastery.history = kcMastery.history || [];
      kcMastery.history.unshift({
        timestamp: Date.now(),
        eventType: eventDetails.interactionType,
        score: eventDetails.score,
        details: eventDetails.interactionDetails
      });
      
      profile.kcMasteryMap[kcId] = kcMastery;
      profile.lastUpdatedTimestamp = Date.now();
      
      return profile;
    }

    const profile = await this.getProfile(userId);
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
    
    // Handle mock user
    if (userId === MOCK_USER_ID) {
      const profile = await this.getProfile(userId);
      return profile.kcMasteryMap[kcId];
    }
    
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
      history: Array.isArray(data.history) ? data.history as Array<{timestamp: number; eventType: string; score?: number; details?: any}> : [],
    };
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to update preferences.");
    
    // Handle mock user
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Mock preferences update for testing');
      const profile = await this.getProfile(userId);
      profile.preferences = { ...profile.preferences, ...preferences };
      return profile;
    }
    
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

const learnerProfileService = new LearnerProfileService();
export default learnerProfileService;
