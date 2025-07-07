
// src/services/learnerProfile/MockLearnerProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';
import { LearnerProfileService } from './types';

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

// In-memory storage for mock profiles
const mockProfileStore: Record<string, LearnerProfile> = {};

export class MockLearnerProfileService implements LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    console.log(`🔍 MockLearnerProfileService: Getting profile for user ${userId}`);
    
    const profile = mockProfileStore[userId];
    if (!profile) {
      console.log(`📝 No profile found for user ${userId}`);
      return null;
    }

    console.log(`✅ Found profile for user ${userId} with ${Object.keys(profile.kcMasteryMap).length} KCs tracked`);
    return { ...profile }; // Return a copy to prevent direct mutation
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    console.log(`🔄 MockLearnerProfileService: Updating KC mastery for user ${userId}, KC ${kcId}`, masteryUpdate);

    // Ensure profile exists
    let profile = mockProfileStore[userId];
    if (!profile) {
      profile = await this.createInitialProfile(userId);
    }

    // Get or create KC mastery record
    let kcMastery = profile.kcMasteryMap[kcId];
    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.5, // Start at neutral
        attempts: 0,
        correctAttempts: 0,
        lastAttemptTimestamp: Date.now(),
        history: []
      };
      profile.kcMasteryMap[kcId] = kcMastery;
    }

    // Update mastery based on performance
    if (masteryUpdate.newAttempt) {
      kcMastery.attempts += 1;
      if (masteryUpdate.isCorrect) {
        kcMastery.correctAttempts += 1;
      }
    }

    // Simple mastery calculation (will be replaced with BKT/IRT later)
    const successRate = kcMastery.attempts > 0 ? kcMastery.correctAttempts / kcMastery.attempts : 0;
    
    // Update mastery level using a simple learning curve
    if (masteryUpdate.isCorrect) {
      kcMastery.masteryLevel = Math.min(1.0, kcMastery.masteryLevel + (1 - kcMastery.masteryLevel) * 0.1);
    } else {
      kcMastery.masteryLevel = Math.max(0.0, kcMastery.masteryLevel - kcMastery.masteryLevel * 0.05);
    }

    // Add to history
    kcMastery.history.push({
      timestamp: Date.now(),
      eventType: masteryUpdate.interactionType,
      score: masteryUpdate.isCorrect ? 1.0 : 0.0,
      details: masteryUpdate.interactionDetails
    });

    kcMastery.lastAttemptTimestamp = Date.now();

    // Update overall profile metrics
    this.updateOverallMastery(profile);
    profile.lastUpdatedTimestamp = Date.now();

    mockProfileStore[userId] = profile;

    console.log(`✅ Updated KC mastery for ${kcId}: level=${kcMastery.masteryLevel.toFixed(3)}, attempts=${kcMastery.attempts}`);
    return { ...profile };
  }

  async getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    return profile.kcMasteryMap[kcId] || null;
  }

  async updatePreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    console.log(`🎯 MockLearnerProfileService: Updating preferences for user ${userId}`, preferences);

    let profile = mockProfileStore[userId];
    if (!profile) {
      profile = await this.createInitialProfile(userId);
    }

    profile.preferences = { ...profile.preferences, ...preferences };
    profile.lastUpdatedTimestamp = Date.now();

    mockProfileStore[userId] = profile;
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    console.log(`🆕 MockLearnerProfileService: Creating initial profile for user ${userId}`);

    const profile: LearnerProfile = {
      userId,
      kcMasteryMap: {},
      preferences: {
        learningStyle: 'mixed',
        difficultyPreference: 0.5,
        sessionLength: 20
      },
      recentPerformance: [],
      overallMastery: 0.0,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now()
    };

    mockProfileStore[userId] = profile;
    return { ...profile };
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log(`🔄 MockLearnerProfileService: Updating full profile for user ${profile.userId}`);
    
    profile.lastUpdatedTimestamp = Date.now();
    mockProfileStore[profile.userId] = { ...profile };
  }

  private updateOverallMastery(profile: LearnerProfile): void {
    const masteryValues = Object.values(profile.kcMasteryMap).map(kc => kc.masteryLevel);
    if (masteryValues.length === 0) {
      profile.overallMastery = 0.0;
    } else {
      profile.overallMastery = masteryValues.reduce((sum, level) => sum + level, 0) / masteryValues.length;
    }
  }

  // Utility method for testing - clear all data
  clearAllProfiles(): void {
    Object.keys(mockProfileStore).forEach(key => delete mockProfileStore[key]);
    console.log('🧹 Cleared all mock profile data');
  }

  // Utility method for testing - get store size
  getStoreSize(): number {
    return Object.keys(mockProfileStore).length;
  }
}

export const mockLearnerProfileService = new MockLearnerProfileService();
