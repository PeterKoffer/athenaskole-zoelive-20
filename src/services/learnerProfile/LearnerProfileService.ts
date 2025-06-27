
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

    // Check if this is our mock user for testing
    if (userId === MOCK_USER_ID) {
      console.log('LearnerProfileService: Using mock profile for testing');
      return mockProfileService.createMockProfile(userId);
    }

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

    // For mock user, just return updated mock profile
    if (userId === MOCK_USER_ID) {
      const profile = await this.getProfile(userId);
      return mockProfileService.updateMockKcMastery(profile, kcId, eventDetails);
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
    kcMastery.history.unshift({
      timestamp: currentTimestamp,
      eventType: eventDetails.interactionType,
      score: eventDetails.score,
      details: eventDetails.interactionDetails,
    });
    if (kcMastery.history.length > 10) kcMastery.history.pop();

    // Update in Supabase
    await supabaseProfileService.updateKcMasteryInSupabase(userId, kcId, kcMastery);
      
    profile.kcMasteryMap[kcId] = kcMastery;
    profile.lastUpdatedTimestamp = currentTimestamp;
    
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
    
    return supabaseProfileService.getKcMastery(userId, kcId);
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile> {
    if (!userId) throw new Error("User ID is required to update preferences.");
    
    // Handle mock user
    if (userId === MOCK_USER_ID) {
      const profile = await this.getProfile(userId);
      return mockProfileService.updateMockPreferences(profile, preferences);
    }
    
    await supabaseProfileService.updatePreferences(userId, preferences);
    return this.getProfile(userId);
  }

  async recommendNextKcs(userId: string, count: number = 3): Promise<KnowledgeComponent[]> {
    if (!userId) throw new Error("User ID is required for recommendations.");
    const profile = await this.getProfile(userId);
    return profileRecommendationService.recommendNextKcs(profile, count);
  }
}

const learnerProfileService = new LearnerProfileService();
export default learnerProfileService;
