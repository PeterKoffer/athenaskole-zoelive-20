
import { supabase } from '@/integrations/supabase/client';
import type { LearnerProfile, InteractionEvent } from '@/types/learnerProfile';

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
    console.log(`📊 Updating KC mastery for user ${userId}, KC ${kcId}`);
    
    // Get current profile
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found for KC mastery update');
    }

    // Update the KC mastery
    let kcMastery = profile.kcMasteryMap[kcId];
    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: eventDetails.isCorrect ? 0.3 : 0.1,
        attempts: 1,
        correctAttempts: eventDetails.isCorrect ? 1 : 0,
        lastAttemptTimestamp: Date.now(),
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
      kcMastery.lastAttemptTimestamp = Date.now();
    }
    
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

  async saveInteractionEvent(
    userId: string,
    kcId: string,
    isCorrect: boolean,
    responseTime: number,
    contentAtomId: string,
    sourceComponentId: string,
    eventData: any
  ): Promise<void> {
    try {
      console.log(`⏺️  Saving interaction event for user ${userId}, KC ${kcId}`);

      // Save interaction event to database
      const { data, error } = await supabase
        .from('interaction_events')
        .insert([
          {
            user_id: userId,
            kc_ids: [kcId],
            content_atom_id: contentAtomId,
            source_component_id: sourceComponentId,
            event_type: 'question_answered',
            event_data: eventData,
          },
        ])
        .select();

      if (error) {
        console.error('❌ Error saving interaction event:', error);
        throw error;
      }

      console.log('✅ Interaction event saved successfully:', data);

    } catch (error) {
      console.error('💥 Error in saveInteractionEvent:', error);
      throw error;
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
