
// src/services/learnerProfile/MockProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery } from '@/types/learnerProfile';

// Test user for Supabase integration testing - matches the one we created in Supabase
export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

export class MockProfileService {
  createMockProfile(userId: string): LearnerProfile {
    console.log(`MockProfileService: Creating mock profile for testing user ${userId}`);
    
    const mockProfile: LearnerProfile = {
      userId: userId,
      kcMasteryMap: {
        'kc_math_g4_add_fractions_likedenom': {
          kcId: 'kc_math_g4_add_fractions_likedenom',
          masteryLevel: 0.3,
          attempts: 2,
          correctAttempts: 1,
          lastAttemptTimestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
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
          lastAttemptTimestamp: Date.now() - 48 * 60 * 60 * 1000, // 2 days ago
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
        learningStyle: 'visual',
        difficultyPreference: 0.5,
        sessionLength: 15
      },
      lastUpdatedTimestamp: Date.now(),
      overallMastery: 0.2,
      recentPerformance: [],
      createdAt: Date.now()
    };

    return mockProfile;
  }

  updateMockKcMastery(
    profile: LearnerProfile,
    kcId: string,
    eventDetails: {
      isCorrect?: boolean;
      newAttempt?: boolean;
      score?: number;
      interactionType: string;
      interactionDetails?: any;
    }
  ): LearnerProfile {
    console.log('MockProfileService: Mock KC mastery update for testing');
    
    // Update the mock profile with new mastery data
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
    }
    
    kcMastery.lastAttemptTimestamp = Date.now();
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

  updateMockPreferences(
    profile: LearnerProfile,
    preferences: Partial<LearnerProfile['preferences']>
  ): LearnerProfile {
    console.log('MockProfileService: Mock preferences update for testing');
    profile.preferences = { ...profile.preferences, ...preferences };
    return profile;
  }
}

export const mockProfileService = new MockProfileService();
