
// src/services/learnerProfile/MockLearnerProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery, KCMasteryUpdateData } from '@/types/learnerProfile';
import { ProfileFactory } from './profileFactory';
import { MockProfileStore } from './mockStore';
import { MasteryCalculator } from './masteryCalculator';
import type { LearnerProfileService } from './types';

export const MOCK_USER_ID = 'mock-user-123';

class MockLearnerProfileService implements LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    console.log(`🔍 MockLearnerProfileService: Getting profile for user ${userId}`);
    
    if (!MockProfileStore.has(userId)) {
      const newProfile = ProfileFactory.createInitialProfile(userId);
      MockProfileStore.set(userId, newProfile);
      console.log(`✅ MockLearnerProfileService: Created new profile for user ${userId}`);
    }
    
    return MockProfileStore.get(userId) || null;
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    console.log(`🆕 MockLearnerProfileService: Creating initial profile for user ${userId}`);
    const profile = ProfileFactory.createInitialProfile(userId);
    MockProfileStore.set(userId, profile);
    return profile;
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log(`💾 MockLearnerProfileService: Updating profile for user ${profile.userId}`);
    MockProfileStore.set(profile.userId, profile);
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    console.log(`📊 MockLearnerProfileService: Updating KC mastery for user ${userId}, KC ${kcId}`);
    
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error(`Profile not found for user ${userId}`);
    }

    // Initialize kcMasteryMap if it doesn't exist
    if (!profile.kcMasteryMap) {
      profile.kcMasteryMap = {};
    }

    // Create KC mastery if it doesn't exist
    if (!profile.kcMasteryMap[kcId]) {
      profile.kcMasteryMap[kcId] = MasteryCalculator.createInitialKcMastery(kcId);
    }

    // Update KC mastery
    MasteryCalculator.updateKcMastery(profile.kcMasteryMap[kcId], masteryUpdate);
    
    // Update overall mastery
    MasteryCalculator.updateOverallMastery(profile);
    
    // Update timestamps
    profile.updated_at = new Date().toISOString();
    profile.lastUpdatedTimestamp = Date.now();

    // Save updated profile
    MockProfileStore.set(userId, profile);
    
    console.log(`✅ MockLearnerProfileService: Updated KC ${kcId} mastery to ${profile.kcMasteryMap[kcId].masteryLevel.toFixed(3)}`);
    
    return profile;
  }

  // New method using KCMasteryUpdateData
  async updateKCMastery(userId: string, kcId: string, updateData: KCMasteryUpdateData): Promise<LearnerProfile> {
    return this.updateKcMastery(userId, kcId, {
      isCorrect: updateData.success,
      newAttempt: true,
      interactionType: updateData.eventType || 'interaction',
      interactionDetails: {
        timeTakenSeconds: (updateData.timeTakenMs || 30000) / 1000,
        hintsUsed: updateData.hintsUsed || 0,
        attempts: updateData.attemptsInInteraction || 1
      }
    });
  }

  async getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    const profile = await this.getProfile(userId);
    return profile?.kcMasteryMap?.[kcId] || null;
  }

  async updatePreferences(userId: string, preferences: Partial<LearnerProfile['preferences']>): Promise<void> {
    const profile = await this.getProfile(userId);
    if (profile) {
      profile.preferences = { ...profile.preferences, ...preferences };
      await this.updateProfile(profile);
    }
  }

  // Test utility methods
  resetStore(): void {
    MockProfileStore.clear();
    console.log('🧹 MockLearnerProfileService: Store reset');
  }

  getStoreSize(): number {
    return MockProfileStore.size();
  }
}

export const mockProfileService = new MockLearnerProfileService();
export { MockLearnerProfileService };
