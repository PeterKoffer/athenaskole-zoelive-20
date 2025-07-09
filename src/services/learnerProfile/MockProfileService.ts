// src/services/learnerProfile/MockProfileService.ts

import {
  LearnerProfile,
  KnowledgeComponentMastery,
  LearnerPreferences,
  InteractionEvent as LocalInteractionEvent, // Renamed to avoid clash with global/richer InteractionEvent
  KCMasteryUpdateData
} from '@/types/learnerProfile';
// We don't need LearningAtomPerformance here anymore for updateKCMastery

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012'; // Keep for tests that might use it

const DEFAULT_PREFERENCES: LearnerPreferences = {
  learningStyle: 'mixed', // Default as per new type
  difficultyPreference: 0.5, // Default as per new type
  sessionLength: 30, // Default as per new type
};

export class MockProfileService {
  private store: Map<string, LearnerProfile> = new Map();

  private getOrCreateProfileSync(userId: string): LearnerProfile {
    if (!this.store.has(userId)) {
      const now = Date.now();
      const newProfile: LearnerProfile = {
        userId,
        kcMasteryMap: {},
        preferences: { ...DEFAULT_PREFERENCES },
        recentPerformance: [], // As per LearnerProfile type
        overallMastery: 0,     // As per LearnerProfile type
        lastUpdatedTimestamp: now,
        createdAt: now,
      };
      this.store.set(userId, newProfile);
      console.log(`🆕 MockProfileService: Created initial profile for user ${userId}`);
    }
    return this.store.get(userId)!;
  }

  async getProfile(userId: string): Promise<LearnerProfile> {
    console.log(`🔍 MockProfileService: Getting profile for user ${userId}`);
    // Return a deep copy to prevent direct mutation of store from outside
    return JSON.parse(JSON.stringify(this.getOrCreateProfileSync(userId)));
  }

  async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<LearnerProfile> {
    console.log(`⚙️ MockProfileService: Updating preferences for user ${userId}`);
    const profile = this.getOrCreateProfileSync(userId);
    profile.preferences = { ...profile.preferences, ...preferences };
    profile.lastUpdatedTimestamp = Date.now();
    // No need to call this.store.set if profile is a direct reference and mutated
    return JSON.parse(JSON.stringify(profile));
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | undefined> {
    const profile = this.getOrCreateProfileSync(userId);
    const kcMastery = profile.kcMasteryMap[kcId];
    return kcMastery ? JSON.parse(JSON.stringify(kcMastery)) : undefined;
  }

  async updateKCMastery(userId: string, kcId: string, updateData: KCMasteryUpdateData): Promise<KnowledgeComponentMastery> {
    console.log(`🧠 MockProfileService: Updating KC mastery for user ${userId}, KC ${kcId}`, updateData);
    const profile = this.getOrCreateProfileSync(userId); // Get direct reference from store
    
    let kcMastery = profile.kcMasteryMap[kcId];
    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.5, // Initial neutral mastery
        attempts: 0,
        correctAttempts: 0,
        history: [],
        lastAttemptTimestamp: 0,
        // currentStreak and timeSpentSeconds are not in the new KnowledgeComponentMastery type
      };
      profile.kcMasteryMap[kcId] = kcMastery;
    }

    kcMastery.attempts += updateData.attemptsInInteraction || 1; // Default to 1 attempt if not specified

    const historyEvent: LocalInteractionEvent = {
      timestamp: new Date(updateData.timestamp).getTime(),
      eventType: updateData.eventType || 'kc_interaction', // Generic type if not specified
      score: updateData.success ? 1 : 0, // Simple score based on success
      details: {
        ...(updateData.details || {}), // Preserve other details if any
        timeTakenMs: updateData.timeTakenMs,
        hintsUsed: updateData.hintsUsed,
      },
    };
    kcMastery.history.push(historyEvent);
    if (kcMastery.history.length > 20) { // Keep history capped
      kcMastery.history.shift();
    }

    if (updateData.success) {
      kcMastery.correctAttempts += 1; // Assuming one successful outcome for this update trigger
      // Simple learning curve: increase mastery
      kcMastery.masteryLevel += (1 - kcMastery.masteryLevel) * 0.25;
    } else {
      // Simple learning curve: decrease mastery
      kcMastery.masteryLevel -= kcMastery.masteryLevel * 0.25;
    }
    kcMastery.masteryLevel = Math.max(0.01, Math.min(0.99, kcMastery.masteryLevel)); // Bound mastery
    kcMastery.lastAttemptTimestamp = new Date(updateData.timestamp).getTime();

    this.calculateOverallMastery(profile); // Update aggregate overallMastery
    profile.lastUpdatedTimestamp = Date.now();
    // profile is a direct reference to the object in the store, so mutations are automatically reflected.
    // this.store.set(userId, profile); // is redundant but harmless.

    return JSON.parse(JSON.stringify(kcMastery)); // Return a copy
  }

  private calculateOverallMastery(profile: LearnerProfile): void {
    const kcIds = Object.keys(profile.kcMasteryMap);
    if (kcIds.length === 0) {
      profile.overallMastery = 0;
      // aggregateMetrics.completedKCs and totalKCsAttempted are not on the new LearnerProfile type
      return;
    }
    let totalMasterySum = 0;
    kcIds.forEach(kcId => {
      totalMasterySum += profile.kcMasteryMap[kcId].masteryLevel;
    });
    profile.overallMastery = totalMasterySum / kcIds.length;
    // No completedKCs or totalKCsAttempted in the new LearnerProfile.aggregateMetrics
  }

  // For testing purposes
  public resetStore(): void {
    this.store.clear();
    console.log('🧹 MockProfileService: Store cleared.');
  }

  public getStoreSize(): number {
    return this.store.size;

// Mock Profile Service with proper exports

import { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';
import { MockLearnerProfileService } from './MockLearnerProfileService';

export const MOCK_USER_ID = 'mock-user-12345';

export class MockProfileService {
  private mockService = new MockLearnerProfileService();

  async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    console.log('👤 MockProfileService: getLearnerProfile');
    
    return {
      userId,
      user_id: userId,
      overall_mastery: 0.5,
      kc_masteries: [],
      kcMasteryMap: {},
      preferences: {
        preferredSubjects: ['Mathematics'],
        learningStyle: 'visual',
        difficultyPreference: 3,
        sessionLength: 20
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      recentPerformance: [],
      overallMastery: 0.5,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now(),
      aggregateMetrics: {
        overallMastery: 0.5,
        completedKCs: 0,
        totalKCsAttempted: 0
      }
    };
  }

  async getKnowledgeComponentMastery(userId: string): Promise<any[]> {
    console.log('📊 MockProfileService: getKnowledgeComponentMastery');
    
    return [
      {
        userId,
        kcId: 'kc_math_addition',
        masteryLevel: 0.8,
        practiceCount: 15,
        lastAssessed: new Date().toISOString()
      }
    ];
  }

  async updateKCMastery(userId: string, kcId: string, performance: any): Promise<void> {
    return this.mockService.updateKCMastery(userId, kcId, performance);
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    return this.mockService.getKCMastery(userId, kcId);
  }

  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return this.mockService.getProfile(userId);
  }

  async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    return this.mockService.updatePreferences(userId, preferences);
  }

  getStoreSize(): number {
    return this.mockService.getStoreSize();
  }

  resetStore(): void {
    this.mockService.resetStore();
  }
}

// Ensure a single instance is exported for consistent mocking and usage
export const mockProfileService = new MockProfileService();
