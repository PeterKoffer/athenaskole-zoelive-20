
// src/services/learnerProfile/MockLearnerProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';
import { LearnerProfileService } from './types';
import { MockProfileStore } from './mockStore';
import { MasteryCalculator } from './masteryCalculator';
import { ProfileFactory } from './profileFactory';

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

export class MockLearnerProfileService implements LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    console.log(`🔍 MockLearnerProfileService: Getting profile for user ${userId}`);
    
    const profile = MockProfileStore.get(userId);
    if (!profile) {
      console.log(`📝 No profile found for user ${userId}`);
      return null;
    }

    console.log(`✅ Found profile for user ${userId} with ${Object.keys(profile.kcMasteryMap || {}).length} KCs tracked`);
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
    let profile = MockProfileStore.get(userId);
    if (!profile) {
      profile = await this.createInitialProfile(userId);
    }

    // Get or create KC mastery record
    let kcMastery = profile.kcMasteryMap?.[kcId];
    if (!kcMastery) {
      kcMastery = MasteryCalculator.createInitialKcMastery(kcId);
      if (!profile.kcMasteryMap) profile.kcMasteryMap = {};
      profile.kcMasteryMap[kcId] = kcMastery;
    }

    // Update mastery using the calculator
    MasteryCalculator.updateKcMastery(kcMastery, masteryUpdate);

    // Update overall profile metrics
    MasteryCalculator.updateOverallMastery(profile);
    profile.lastUpdatedTimestamp = Date.now();

    MockProfileStore.set(userId, profile);

    console.log(`✅ Updated KC mastery for ${kcId}: level=${kcMastery.masteryLevel.toFixed(3)}, attempts=${kcMastery.totalAttempts}`);
    return { ...profile };
  }

  async getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    const profile = await this.getProfile(userId);
    if (!profile || !profile.kcMasteryMap) return null;

    return profile.kcMasteryMap[kcId] || null;
  }

  async updatePreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    console.log(`🎯 MockLearnerProfileService: Updating preferences for user ${userId}`, preferences);

    let profile = MockProfileStore.get(userId);
    if (!profile) {
      profile = await this.createInitialProfile(userId);
    }

    profile.preferences = { ...profile.preferences, ...preferences };
    profile.lastUpdatedTimestamp = Date.now();

    MockProfileStore.set(userId, profile);
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    const profile = ProfileFactory.createInitialProfile(userId);
    MockProfileStore.set(userId, profile);
    return { ...profile };
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log(`🔄 MockLearnerProfileService: Updating full profile for user ${profile.userId}`);
    
    profile.lastUpdatedTimestamp = Date.now();
    MockProfileStore.set(profile.userId, { ...profile });
  }

  // Additional methods for testing
  async updateKCMastery(userId: string, kcId: string, performance: {
    attempts: number;
    timeTakenSeconds: number;
    hintsUsed: number;
    success: boolean;
    firstAttemptSuccess: boolean;
    timestamp: string;
  }): Promise<void> {
    await this.updateKcMastery(userId, kcId, {
      isCorrect: performance.success,
      newAttempt: true,
      interactionType: 'question_attempt',
      interactionDetails: performance
    });
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    return this.getKcMastery(userId, kcId);
  }

  resetStore(): void {
    MockProfileStore.clear();
    console.log('🧹 Cleared all mock profile data');
  }

  getStoreSize(): number {
    return MockProfileStore.size();
  }
}

export const mockLearnerProfileService = new MockLearnerProfileService();
export const mockProfileService = mockLearnerProfileService;
