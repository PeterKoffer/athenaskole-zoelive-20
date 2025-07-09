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
    let profile = mockProfileStore[userId];
    if (!profile) {
      profile = await this.createInitialProfile(userId);
    }

    // Get or create KC mastery record
    let kcMastery = profile.kcMasteryMap?.[kcId];
    if (!kcMastery) {
      kcMastery = {
        kcId,
        masteryLevel: 0.5, // Start at neutral
        practiceCount: 0,
        lastAssessed: new Date().toISOString(),
        totalAttempts: 0,
        successfulAttempts: 0,
        currentStreak: 0,
        interactionHistory: []
      };
      if (!profile.kcMasteryMap) profile.kcMasteryMap = {};
      profile.kcMasteryMap[kcId] = kcMastery;
    }

    // Update mastery based on performance
    if (masteryUpdate.newAttempt) {
      kcMastery.totalAttempts = (kcMastery.totalAttempts || 0) + 1;
      if (masteryUpdate.isCorrect) {
        kcMastery.successfulAttempts = (kcMastery.successfulAttempts || 0) + 1;
        kcMastery.currentStreak = (kcMastery.currentStreak || 0) + 1;
      } else {
        kcMastery.currentStreak = 0;
      }
    }

    // Simple mastery calculation using BKT-like approach
    if (masteryUpdate.isCorrect) {
      kcMastery.masteryLevel = Math.min(0.99, kcMastery.masteryLevel + (1 - kcMastery.masteryLevel) * 0.25);
    } else {
      kcMastery.masteryLevel = Math.max(0.01, kcMastery.masteryLevel - kcMastery.masteryLevel * 0.25);
    }

    // Add to history (keep last 20 entries)
    if (!kcMastery.interactionHistory) kcMastery.interactionHistory = [];
    kcMastery.interactionHistory.push({
      timestamp: new Date().toISOString(),
      success: masteryUpdate.isCorrect,
      timeTakenSeconds: masteryUpdate.interactionDetails?.timeTakenSeconds || 30,
      hintsUsed: masteryUpdate.interactionDetails?.hintsUsed || 0,
      attempts: masteryUpdate.interactionDetails?.attempts || 1,
      firstAttemptSuccess: masteryUpdate.isCorrect && (masteryUpdate.interactionDetails?.attempts || 1) === 1
    });

    // Keep only last 20 interactions
    if (kcMastery.interactionHistory.length > 20) {
      kcMastery.interactionHistory = kcMastery.interactionHistory.slice(-20);
    }

    kcMastery.lastAssessed = new Date().toISOString();
    kcMastery.practiceCount = kcMastery.totalAttempts || 0;

    // Update overall profile metrics
    this.updateOverallMastery(profile);
    profile.lastUpdatedTimestamp = Date.now();

    mockProfileStore[userId] = profile;

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

    mockProfileStore[userId] = profile;
    return { ...profile };
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log(`🔄 MockLearnerProfileService: Updating full profile for user ${profile.userId}`);
    
    profile.lastUpdatedTimestamp = Date.now();
    mockProfileStore[profile.userId] = { ...profile };
  }

  private updateOverallMastery(profile: LearnerProfile): void {
    if (!profile.kcMasteryMap) {
      profile.overallMastery = 0.0;
      if (!profile.aggregateMetrics) profile.aggregateMetrics = { overallMastery: 0, completedKCs: 0, totalKCsAttempted: 0 };
      profile.aggregateMetrics.overallMastery = 0;
      profile.aggregateMetrics.completedKCs = 0;
      profile.aggregateMetrics.totalKCsAttempted = 0;
      return;
    }

    const masteryValues = Object.values(profile.kcMasteryMap).map(kc => kc.masteryLevel);
    if (masteryValues.length === 0) {
      profile.overallMastery = 0.0;
    } else {
      profile.overallMastery = masteryValues.reduce((sum, level) => sum + level, 0) / masteryValues.length;
    }

    // Update aggregate metrics
    if (!profile.aggregateMetrics) profile.aggregateMetrics = { overallMastery: 0, completedKCs: 0, totalKCsAttempted: 0 };
    profile.aggregateMetrics.overallMastery = profile.overallMastery;
    profile.aggregateMetrics.totalKCsAttempted = masteryValues.length;
    profile.aggregateMetrics.completedKCs = masteryValues.filter(level => level >= 0.85).length;
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
    Object.keys(mockProfileStore).forEach(key => delete mockProfileStore[key]);
    console.log('🧹 Cleared all mock profile data');
  }

  getStoreSize(): number {
    return Object.keys(mockProfileStore).length;
  }
}

export const mockLearnerProfileService = new MockLearnerProfileService();
export const mockProfileService = mockLearnerProfileService;
