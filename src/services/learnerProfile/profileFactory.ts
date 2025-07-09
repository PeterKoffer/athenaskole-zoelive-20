
// src/services/learnerProfile/profileFactory.ts

import { LearnerProfile } from '@/types/learnerProfile';

export class ProfileFactory {
  static createInitialProfile(userId: string): LearnerProfile {
    console.log(`🆕 MockLearnerProfileService: Creating initial profile for user ${userId}`);

    return {
      userId,
      user_id: userId,
      overall_mastery: 0.0,
      kc_masteries: [],
      kcMasteryMap: {},
      preferences: {
        preferredSubjects: ['Mathematics'],
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 20
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      recentPerformance: [],
      overallMastery: 0.0,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now(),
      aggregateMetrics: {
        overallMastery: 0,
        completedKCs: 0,
        totalKCsAttempted: 0
      }
    };
  }
}
