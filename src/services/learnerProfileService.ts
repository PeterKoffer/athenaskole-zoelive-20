// src/services/learnerProfileService.ts

import {
  LearnerProfile,
  KcMastery,
  ILearnerProfileService,
} from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import knowledgeComponentService from './knowledgeComponentService'; // To get KC details
import stealthAssessmentService from './stealthAssessmentService'; // Potentially to log profile changes
import { InteractionEventType } from '@/types/stealthAssessment';

// Mock database for storing learner profiles in memory for now.
// In a real app, this would interact with Supabase or another backend.
const learnerProfilesDB: Record<string, LearnerProfile> = {};

// Placeholder for user context - in a real app, this would come from an auth service
const getCurrentUserId = (): string => {
  // TODO: Replace with actual user ID from auth context
  return 'mockUser123';
};


class LearnerProfileService implements ILearnerProfileService {

  private async initializeProfile(userId: string): Promise<LearnerProfile> {
    if (learnerProfilesDB[userId]) {
      return learnerProfilesDB[userId];
    }
    // Create a new profile if one doesn't exist
    const newProfile: LearnerProfile = {
      userId,
      kcMasteryMap: {},
      preferences: {
        learningPace: 'medium',
        learningStyle: 'mixed',
      },
      lastUpdatedTimestamp: Date.now(),
    };
    learnerProfilesDB[userId] = newProfile;
    console.log(`LearnerProfileService: Initialized new profile for user ${userId}`);
    return newProfile;
  }

  async getProfile(userId: string): Promise<LearnerProfile> {
    // Simulate async operation
    await Promise.resolve();
    return this.initializeProfile(userId);
  }

  async updateKcMastery(
    userId: string,
    kcId: string,
    eventDetails: {
      isCorrect?: boolean;
      newAttempt?: boolean; // If true, increments attempts
      score?: number; // For more nuanced updates, e.g. partial credit
      interactionType: string;
      interactionDetails?: any;
    }
  ): Promise<LearnerProfile> {
    const profile = await this.getProfile(userId);
    let kcMastery = profile.kcMasteryMap[kcId];

    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.0, // Initial mastery
        attempts: 0,
        correctAttempts: 0,
        history: [],
      };
    }

    // Update attempts
    if (eventDetails.newAttempt) {
      kcMastery.attempts += 1;
    }

    // Update correct attempts and mastery level (simple incremental logic for now)
    // This will be replaced by BKT/IRT models later.
    if (eventDetails.isCorrect !== undefined) {
      if (eventDetails.isCorrect) {
        kcMastery.correctAttempts += 1;
        // Simple incremental mastery - very basic!
        kcMastery.masteryLevel = Math.min(1.0, kcMastery.masteryLevel + 0.1);
      } else {
        // Simple decrement, ensuring it doesn't go below 0
        kcMastery.masteryLevel = Math.max(0.0, kcMastery.masteryLevel - 0.05);
      }
    } else if (eventDetails.score !== undefined) {
      // If a direct score is provided (e.g. from a game, 0.0 to 1.0)
      // This could be a weighted update or direct setting depending on strategy
      kcMastery.masteryLevel = Math.max(0.0, Math.min(1.0,
        (kcMastery.masteryLevel * kcMastery.attempts + eventDetails.score) / (kcMastery.attempts + (eventDetails.newAttempt ? 1 : 0) || 1)
      ));
    }

    // Ensure mastery is within bounds [0,1]
    kcMastery.masteryLevel = Math.max(0.0, Math.min(1.0, kcMastery.masteryLevel));


    kcMastery.lastAttemptedTimestamp = Date.now();

    // Add to history (limited length)
    kcMastery.history = kcMastery.history || [];
    kcMastery.history.unshift({
      timestamp: Date.now(),
      eventType: eventDetails.interactionType,
      score: eventDetails.score,
      details: eventDetails.interactionDetails
    });
    if (kcMastery.history.length > 10) { // Keep last 10 interactions for this KC
      kcMastery.history.pop();
    }

    profile.kcMasteryMap[kcId] = kcMastery;
    profile.lastUpdatedTimestamp = Date.now();

    console.log(`LearnerProfileService: Updated KC mastery for user ${userId}, KC ${kcId}:`, kcMastery);

    // Log this change using StealthAssessmentService (optional, could be too noisy)
    // await stealthAssessmentService.logProfileUpdate({ userId, updatedFields: [`kcMasteryMap.${kcId}`] });

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
    let profile = await this.getProfile(userId);
    for (const update of updates) {
      // Note: This updates the profile object iteratively.
      // In a real DB scenario, you might batch these updates.
      profile = await this.updateKcMastery(userId, update.kcId, update.eventDetails);
    }
    return profile;
  }

  async getKcMastery(userId: string, kcId: string): Promise<KcMastery | undefined> {
    const profile = await this.getProfile(userId);
    return profile.kcMasteryMap[kcId];
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile> {
    const profile = await this.getProfile(userId);
    profile.preferences = { ...profile.preferences, ...preferences };
    profile.lastUpdatedTimestamp = Date.now();
    console.log(`LearnerProfileService: Updated preferences for user ${userId}:`, profile.preferences);
    return profile;
  }

  async recommendNextKcs(userId: string, count: number = 3): Promise<KnowledgeComponent[]> {
    const profile = await this.getProfile(userId);

    // Very simple recommendation logic for now:
    // 1. Find KCs not yet mastered (mastery < 0.8).
    // 2. Prioritize KCs that have some attempts but are not fully mastered.
    // 3. Filter by grade level (e.g., current grade of user - needs user grade info).
    // 4. Consider prerequisites (KCs whose prerequisites are mastered).
    // This is a placeholder for much more sophisticated logic.

    const allKcs = await knowledgeComponentService.searchKcs(''); // Get all KCs

    const potentialKcs = allKcs.filter(kc => {
      const mastery = profile.kcMasteryMap[kc.id];
      if (!mastery) return true; // Not attempted yet
      return mastery.masteryLevel < 0.8; // Not fully mastered
    });

    // Sort by some criteria (e.g., attempted but not mastered, then by difficulty or importance)
    potentialKcs.sort((a, b) => {
      const masteryA = profile.kcMasteryMap[a.id]?.masteryLevel || 0;
      const masteryB = profile.kcMasteryMap[b.id]?.masteryLevel || 0;
      const attemptsA = profile.kcMasteryMap[a.id]?.attempts || 0;
      const attemptsB = profile.kcMasteryMap[b.id]?.attempts || 0;

      if (attemptsA > 0 && masteryA < 0.8 && (attemptsB === 0 || masteryB >= 0.8)) return -1;
      if (attemptsB > 0 && masteryB < 0.8 && (attemptsA === 0 || masteryA >= 0.8)) return 1;

      return (a.difficultyEstimate || 0) - (b.difficultyEstimate || 0); // Fallback to difficulty
    });

    console.log(`LearnerProfileService: Recommended next KCs for user ${userId}:`, potentialKcs.slice(0, count).map(kc=>kc.id));
    return potentialKcs.slice(0, count);
  }
}

// Export a singleton instance
const learnerProfileService = new LearnerProfileService();
export default learnerProfileService;

// Example Usage
// import learnerProfileService from '@/services/learnerProfileService';
//
// async function exampleProfileOps() {
//   const userId = getCurrentUserId(); // or some specific user ID
//   let profile = await learnerProfileService.getProfile(userId);
//   console.log('Initial profile:', profile);
//
//   profile = await learnerProfileService.updateKcMastery(userId, 'kc_math_g4_add_fractions_likedenom', {
//     isCorrect: true,
//     newAttempt: true,
//     interactionType: InteractionEventType.QUESTION_ATTEMPT
//   });
//   console.log('Profile after correct attempt:', profile);
//
//   profile = await learnerProfileService.updateKcMastery(userId, 'kc_math_g3_understand_fractions_unit', {
//     isCorrect: false,
//     newAttempt: true,
//     interactionType: InteractionEventType.QUESTION_ATTEMPT
//   });
//   console.log('Profile after incorrect attempt:', profile);
//
//   const mastery = await learnerProfileService.getKcMastery(userId, 'kc_math_g4_add_fractions_likedenom');
//   console.log('Mastery for kc_math_g4_add_fractions_likedenom:', mastery);
//
//   const recommendations = await learnerProfileService.recommendNextKcs(userId, 2);
//   console.log('Recommended KCs:', recommendations);
//
//   await learnerProfileService.updatePreferences(userId, { learningStyle: 'visual' });
// }
//
// exampleProfileOps();
