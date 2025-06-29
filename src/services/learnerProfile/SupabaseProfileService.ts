
// src/services/learnerProfile/SupabaseProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery } from '@/types/learnerProfile';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseProfileService {
  async fetchOrCreateProfile(userId: string): Promise<LearnerProfile> {
    console.log(`SupabaseProfileService: Fetching or creating profile for user ${userId}`);
    
    try {
      const { data: existingProfileData, error: fetchError } = await supabase
        .from('learner_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('SupabaseProfileService: Error fetching profile:', fetchError);
        throw fetchError;
      }

      if (existingProfileData) {
        console.log('SupabaseProfileService: Found existing profile, fetching KC mastery data...');
        
        const { data: kcMasteryData, error: kcsError } = await supabase
          .from('kc_mastery')
          .select('*')
          .eq('user_id', userId);

        if (kcsError) {
          console.error('SupabaseProfileService: Error fetching KC mastery data:', kcsError);
          throw kcsError;
        }
        
        const kcMasteryMap: Record<string, KnowledgeComponentMastery> = {};
        kcMasteryData?.forEach(km => {
          kcMasteryMap[km.kc_id] = {
            kcId: km.kc_id,
            masteryLevel: km.mastery_level,
            attempts: km.attempts,
            correctAttempts: km.correct_attempts,
            lastAttemptTimestamp: km.last_attempted_timestamp ? new Date(km.last_attempted_timestamp).getTime() : Date.now(),
            history: Array.isArray(km.history) ? km.history as Array<{timestamp: number; eventType: string; score?: number; details?: any}> : [],
          };
        });

        console.log(`SupabaseProfileService: Successfully loaded profile with ${Object.keys(kcMasteryMap).length} KC mastery entries`);

        // Type assertion for preferences with fallback
        const preferences = (existingProfileData.preferences && typeof existingProfileData.preferences === 'object' && !Array.isArray(existingProfileData.preferences)) 
          ? existingProfileData.preferences as { learningStyle?: 'mixed' | 'visual' | 'kinesthetic' | 'auditory'; difficultyPreference?: number; sessionLength?: number }
          : { learningStyle: 'mixed' as const, difficultyPreference: 0.5, sessionLength: 15 };

        return {
          userId: existingProfileData.user_id,
          overallMastery: existingProfileData.overall_mastery || 0,
          preferences: {
            learningStyle: preferences.learningStyle || 'mixed',
            difficultyPreference: preferences.difficultyPreference || 0.5,
            sessionLength: preferences.sessionLength || 15
          },
          lastUpdatedTimestamp: new Date(existingProfileData.last_updated_timestamp).getTime(),
          kcMasteryMap,
          recentPerformance: [],
          createdAt: Date.now()
        };
      }

      console.log('SupabaseProfileService: No existing profile found, creating new one...');
      return this.createNewProfile(userId);
    } catch (error) {
      console.error('SupabaseProfileService: Error in fetchOrCreateProfile:', error);
      // Return a basic profile structure as fallback
      console.log('SupabaseProfileService: Returning fallback profile structure');
      return {
        userId: userId,
        kcMasteryMap: {},
        preferences: { learningStyle: 'mixed' as const, difficultyPreference: 0.5, sessionLength: 15 },
        lastUpdatedTimestamp: Date.now(),
        recentPerformance: [],
        overallMastery: 0,
        createdAt: Date.now()
      };
    }
  }

  private async createNewProfile(userId: string): Promise<LearnerProfile> {
    console.log(`SupabaseProfileService: Creating new profile for user ${userId}`);
    
    const defaultPreferences = { learningStyle: 'mixed' as const, difficultyPreference: 0.5, sessionLength: 15 };
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
      recentPerformance: [],
      overallMastery: 0,
      createdAt: Date.now()
    };
  }

  async updateKcMasteryInSupabase(
    userId: string,
    kcId: string,
    kcMastery: KnowledgeComponentMastery
  ): Promise<void> {
    console.log(`SupabaseProfileService: Updating KC mastery in Supabase for user ${userId}, KC ${kcId}`);
    
    const currentISOTimestamp = new Date(kcMastery.lastAttemptTimestamp || Date.now()).toISOString();

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
      console.error(`SupabaseProfileService: Error upserting KC mastery for ${kcId}:`, upsertError);
      throw upsertError;
    }

    // Update profile's lastUpdatedTimestamp
    const { error: profileUpdateError } = await supabase
      .from('learner_profiles')
      .update({ last_updated_timestamp: currentISOTimestamp })
      .eq('user_id', userId);
      
    if (profileUpdateError) {
      console.error(`SupabaseProfileService: Error updating profile timestamp:`, profileUpdateError);
    }
      
    console.log(`SupabaseProfileService: Successfully updated KC mastery in Supabase for user ${userId}, KC ${kcId}`);
  }

  async getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | undefined> {
    console.log(`SupabaseProfileService: Getting KC mastery for user ${userId}, KC ${kcId}`);
    
    const { data, error } = await supabase
      .from('kc_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('kc_id', kcId)
      .maybeSingle();

    if (error) {
      console.error('SupabaseProfileService: Error fetching single KC mastery:', error);
      throw error;
    }
    if (!data) {
      console.log(`SupabaseProfileService: No KC mastery found for user ${userId}, KC ${kcId}`);
      return undefined;
    }

    console.log(`SupabaseProfileService: Successfully retrieved KC mastery for user ${userId}, KC ${kcId}`);
    return {
      kcId: data.kc_id,
      masteryLevel: data.mastery_level,
      attempts: data.attempts,
      correctAttempts: data.correct_attempts,
      lastAttemptTimestamp: data.last_attempted_timestamp ? new Date(data.last_attempted_timestamp).getTime() : Date.now(),
      history: Array.isArray(data.history) ? data.history as Array<{timestamp: number; eventType: string; score?: number; details?: any}> : [],
    };
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<void> {
    console.log(`SupabaseProfileService: Updating preferences for user ${userId}`);
    
    const currentISOTimestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('learner_profiles')
      .update({ preferences, last_updated_timestamp: currentISOTimestamp })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('SupabaseProfileService: Error updating preferences:', error);
      throw error;
    }
    if (!data) throw new Error("Profile not found for preference update.");

    console.log(`SupabaseProfileService: Successfully updated preferences for user ${userId}`);
  }
}

export const supabaseProfileService = new SupabaseProfileService();
