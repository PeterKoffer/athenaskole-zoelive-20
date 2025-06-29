
// src/services/learnerProfile/LearnerProfileService.ts

import {
  LearnerProfile,
  KcMastery,
  ILearnerProfileService,
} from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { mockProfileService, MOCK_USER_ID } from './MockProfileService';
import { supabaseProfileService } from './SupabaseProfileService';
import { profileRecommendationService } from './ProfileRecommendationService';

class LearnerProfileService implements ILearnerProfileService {
  
  async getProfile(userId: string): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to get a profile.");
    console.log(`LearnerProfileService: Getting profile for user ${userId}`);

    // For the real test user, always use Supabase (no mock fallback)
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Using Supabase for test user (no mock fallback)');
      return supabaseProfileService.fetchOrCreateProfile(userId);
    }

    // For all other users, also use Supabase (this is the production behavior)
    console.log('LearnerProfileService: Using Supabase for production user');
    return supabaseProfileService.fetchOrCreateProfile(userId);
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
    console.log(`LearnerProfileService: Updating KC mastery for user ${userId}, KC ${kcId}`);

    // For the real test user, always use Supabase (no mock fallback)
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Using Supabase KC mastery update for test user');
    } else {
      console.log('LearnerProfileService: Using Supabase KC mastery update for production user');
    }

    const profile = await this.getProfile(userId);
    let kcMastery = profile.kcMasteryMap[kcId];

    const currentTimestamp = Date.now();

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

    // Determine the binary correctness for BKT-friendly history
    let observedCorrect: boolean | undefined = eventDetails.isCorrect;
    if (observedCorrect === undefined && eventDetails.score !== undefined) {
      // Attempt to infer from score if isCorrect is not explicitly provided
      // This threshold might need adjustment based on scoring system (e.g. > 0.5 for normalized scores)
      observedCorrect = eventDetails.score > 0;
    }

    kcMastery.history.unshift({
      timestamp: currentTimestamp,
      eventType: eventDetails.interactionType,
      score: eventDetails.score, // Keep original score for other purposes
      isCorrect: observedCorrect, // Add the binary correctness observation
      details: eventDetails.interactionDetails,
    });
    if (kcMastery.history.length > 20) { // Increased history length for BKT
        kcMastery.history.pop();
    }

    // Update in Supabase (for both test and production users)
    console.log(`LearnerProfileService: Attempting Supabase KC mastery update for user ${userId}, KC ${kcId}`);
    await supabaseProfileService.updateKcMasteryInSupabase(userId, kcId, kcMastery);
      
    profile.kcMasteryMap[kcId] = kcMastery;
    profile.lastUpdatedTimestamp = currentTimestamp;
    
    console.log(`LearnerProfileService: Successfully updated KC mastery in Supabase for user ${userId}, KC ${kcId}`);
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
    console.log(`LearnerProfileService: Batch updating KC mastery for user ${userId}`);
    
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
    console.log(`LearnerProfileService: Getting KC mastery for user ${userId}, KC ${kcId}`);
    
    // Always use Supabase for KC mastery retrieval
    return supabaseProfileService.getKcMastery(userId, kcId);
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to update preferences.");
    console.log(`LearnerProfileService: Updating preferences for user ${userId}`);
    
    // Always use Supabase for preferences update
    await supabaseProfileService.updatePreferences(userId, preferences);
    return this.getProfile(userId);
  }

  async recommendNextKcs(userId: string, count: number = 3): Promise<KnowledgeComponent[]> {
    if (!userId) throw new Error("User ID is required for recommendations.");
    console.log(`LearnerProfileService: Getting recommendations for user ${userId}`);
    
    const profile = await this.getProfile(userId);
    return profileRecommendationService.recommendNextKcs(profile, count);
  }
}

const learnerProfileService = new LearnerProfileService();
export default learnerProfileService;
