
// src/services/learnerProfile/MockProfileService.ts

import {
  LearnerProfile,
  KnowledgeComponentMastery,
  LearnerPreferences,
  InteractionEvent
} from '@/types/learnerProfile';
import { LearningAtomPerformance } from '@/types/learning';

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

const DEFAULT_PREFERENCES: LearnerPreferences = {
  learningPace: 'medium',
  preferredDifficulty: 'medium',
  preferredInteractionTypes: [],
  targetSessionLengthMinutes: 30,
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
        recentPerformance: [],
        aggregateMetrics: {
          overallMastery: 0,
          completedKCs: 0,
          totalKCsAttempted: 0,
          timeSpentSeconds: 0,
        },
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
    return JSON.parse(JSON.stringify(this.getOrCreateProfileSync(userId))); // Deep copy
  }

  async updateProfile(userId: string, updates: Partial<LearnerProfile>): Promise<LearnerProfile> {
    console.log(`🔄 MockProfileService: Updating profile for user ${userId}`);
    const profile = this.getOrCreateProfileSync(userId);
    // Simple merge, not handling deep merge of kcMasteryMap or preferences here directly
    // Those should be updated via specific methods like updateKCMastery or updateUserPreferences
    const updatedProfile = { ...profile, ...updates, lastUpdatedTimestamp: Date.now() };
    this.store.set(userId, updatedProfile);
    return JSON.parse(JSON.stringify(updatedProfile));
  }

  async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<LearnerProfile> {
    console.log(`⚙️ MockProfileService: Updating preferences for user ${userId}`);
    const profile = this.getOrCreateProfileSync(userId);
    profile.preferences = { ...profile.preferences, ...preferences };
    profile.lastUpdatedTimestamp = Date.now();
    this.store.set(userId, profile);
    return JSON.parse(JSON.stringify(profile));
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | undefined> {
    const profile = this.getOrCreateProfileSync(userId);
    return profile.kcMasteryMap[kcId] ? JSON.parse(JSON.stringify(profile.kcMasteryMap[kcId])) : undefined;
  }

  async updateKCMastery(userId: string, kcId: string, performance: LearningAtomPerformance): Promise<KnowledgeComponentMastery> {
    console.log(`🧠 MockProfileService: Updating KC mastery for user ${userId}, KC ${kcId}`);
    const profile = this.getOrCreateProfileSync(userId);
    
    let kcMastery = profile.kcMasteryMap[kcId];
    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.5, // Initial neutral mastery
        totalAttempts: 0,
        successfulAttempts: 0,
        interactionHistory: [],
        lastAttemptTimestamp: 0,
        currentStreak: 0,
        timeSpentSeconds: 0,
      };
    }

    kcMastery.totalAttempts += performance.attempts; // Assuming performance.attempts is for this interaction with the KC
    kcMastery.timeSpentSeconds += performance.timeTakenSeconds;

    const interactionEvent: InteractionEvent = {
      timestamp: new Date(performance.timestamp).getTime(),
      success: performance.success,
      timeTakenSeconds: performance.timeTakenSeconds,
      hintsUsed: performance.hintsUsed,
      // difficulty: performance.difficulty || 'medium', // performance.difficulty doesn't exist on LearningAtomPerformance
      // For now, we'll assume the difficulty is handled by the learning atom itself
    };
    kcMastery.interactionHistory.push(interactionEvent);
    if (kcMastery.interactionHistory.length > 20) { // Keep history capped
      kcMastery.interactionHistory.shift();
    }

    if (performance.success) {
      kcMastery.successfulAttempts += 1; // Assuming performance.attempts was 1 for this specific KC interaction
      kcMastery.currentStreak = (kcMastery.currentStreak || 0) + 1;
      // Simple learning curve: increase mastery, more if already somewhat proficient
      kcMastery.masteryLevel += (1 - kcMastery.masteryLevel) * 0.25;
    } else {
      kcMastery.currentStreak = 0;
      // Simple learning curve: decrease mastery, more if already struggling
      kcMastery.masteryLevel -= kcMastery.masteryLevel * 0.25;
    }
    kcMastery.masteryLevel = Math.max(0.01, Math.min(0.99, kcMastery.masteryLevel)); // Bound mastery
    kcMastery.lastAttemptTimestamp = new Date(performance.timestamp).getTime();

    profile.kcMasteryMap[kcId] = kcMastery;
    this.calculateOverallMastery(profile); // Update aggregate
    profile.lastUpdatedTimestamp = Date.now();
    this.store.set(userId, profile);

    return JSON.parse(JSON.stringify(kcMastery));
  }

  private calculateOverallMastery(profile: LearnerProfile): void {
    const kcIds = Object.keys(profile.kcMasteryMap);
    if (kcIds.length === 0) {
      profile.aggregateMetrics.overallMastery = 0;
      profile.aggregateMetrics.completedKCs = 0;
      profile.aggregateMetrics.totalKCsAttempted = 0;
      return;
    }
    let totalMasterySum = 0;
    let completedKCs = 0;
    kcIds.forEach(kcId => {
      const mastery = profile.kcMasteryMap[kcId].masteryLevel;
      totalMasterySum += mastery;
      if (mastery >= 0.85) { // Arbitrary threshold for "completed" KC
        completedKCs++;
      }
    });
    profile.aggregateMetrics.overallMastery = totalMasterySum / kcIds.length;
    profile.aggregateMetrics.completedKCs = completedKCs;
    profile.aggregateMetrics.totalKCsAttempted = kcIds.length;
  }

  // For testing purposes
  public resetStore(): void {
    this.store.clear();
    console.log('🧹 MockProfileService: Store cleared.');
  }

  public getStoreSize(): number {
    return this.store.size;
  }
}

export const mockProfileService = new MockProfileService();
