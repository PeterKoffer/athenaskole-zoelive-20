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
  KCMasteryUpdateData
} from '@/types/learnerProfile';

export const MOCK_USER_ID = 'mock-user-12345';

// In-memory store for profiles
const profileStore = new Map<string, LearnerProfile>();

export class MockProfileService {
  /**
   * Get or create a learner profile synchronously
   */
  private getOrCreateProfileSync(userId: string): LearnerProfile {
    let profile = profileStore.get(userId);
    
    if (!profile) {
      profile = {
        userId,
        user_id: userId,
        overall_mastery: 0.0,
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
        overallMastery: 0.0,
        lastUpdatedTimestamp: Date.now(),
        createdAt: Date.now(),
        aggregateMetrics: {
          overallMastery: 0.0,
          completedKCs: 0,
          totalKCsAttempted: 0
        }
      };
      profileStore.set(userId, profile);
      console.log('🆕 Created new profile for user:', userId);
    }
    
    return profile;
  }

  async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    console.log('👤 MockProfileService: getLearnerProfile');
    return this.getOrCreateProfileSync(userId);
  }

  async getKnowledgeComponentMastery(userId: string): Promise<any[]> {
    console.log('📊 MockProfileService: getKnowledgeComponentMastery');
    const profile = this.getOrCreateProfileSync(userId);
    
    return Object.values(profile.kcMasteryMap || {}).map(kc => ({
      userId,
      kcId: kc.kcId,
      masteryLevel: kc.masteryLevel,
      practiceCount: kc.practiceCount,
      lastAssessed: kc.lastAssessed
    }));
  }

  async updateKCMastery(userId: string, kcId: string, updateData: KCMasteryUpdateData): Promise<void> {
    console.log('🧠 MockProfileService: updateKCMastery', { userId, kcId, updateData });
    
    const profile = this.getOrCreateProfileSync(userId);
    
    // Initialize kcMasteryMap if it doesn't exist
    if (!profile.kcMasteryMap) {
      profile.kcMasteryMap = {};
    }
    
    // Get or create KC mastery record
    let kcMastery = profile.kcMasteryMap[kcId];
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
      profile.kcMasteryMap[kcId] = kcMastery;
    }
    
    // Update attempts and streak
    kcMastery.totalAttempts += updateData.attemptsInInteraction || 1;
    if (updateData.success) {
      kcMastery.successfulAttempts += 1;
      kcMastery.currentStreak += 1;
    } else {
      kcMastery.currentStreak = 0;
    }
    
    // Update mastery level using BKT-like approach
    const learningRate = 0.2;
    const forgettingRate = 0.1;
    
    if (updateData.success) {
      // Increase mastery when successful
      kcMastery.masteryLevel = Math.min(0.99, 
        kcMastery.masteryLevel + (1 - kcMastery.masteryLevel) * learningRate
      );
    } else {
      // Decrease mastery when unsuccessful
      kcMastery.masteryLevel = Math.max(0.01, 
        kcMastery.masteryLevel - kcMastery.masteryLevel * forgettingRate
      );
    }
    
    // Add to history (keep last 20 entries)
    if (!kcMastery.interactionHistory) {
      kcMastery.interactionHistory = [];
    }
    
    kcMastery.interactionHistory.push({
      timestamp: updateData.timestamp,
      success: updateData.success,
      timeTakenSeconds: (updateData.timeTakenMs || 30000) / 1000,
      hintsUsed: updateData.hintsUsed || 0,
      attempts: updateData.attemptsInInteraction || 1,
      firstAttemptSuccess: updateData.success && (updateData.attemptsInInteraction || 1) === 1
    });
    
    // Keep only last 20 interactions
    if (kcMastery.interactionHistory.length > 20) {
      kcMastery.interactionHistory = kcMastery.interactionHistory.slice(-20);
    }
    
    // Update timestamps
    kcMastery.lastAssessed = updateData.timestamp;
    kcMastery.practiceCount = kcMastery.totalAttempts;
    
    // Recalculate overall mastery
    this.recalculateOverallMastery(profile);
    
    // Update profile timestamps
    profile.updated_at = new Date().toISOString();
    profile.lastUpdatedTimestamp = Date.now();
    
    console.log(`✅ Updated KC mastery for ${kcId}: level=${kcMastery.masteryLevel.toFixed(3)}, attempts=${kcMastery.totalAttempts}`);
  }

  private recalculateOverallMastery(profile: LearnerProfile): void {
    if (!profile.kcMasteryMap) {
      profile.overallMastery = 0.0;
      profile.overall_mastery = 0.0;
      return;
    }
    
    const masteryValues = Object.values(profile.kcMasteryMap).map(kc => kc.masteryLevel);
    if (masteryValues.length === 0) {
      profile.overallMastery = 0.0;
      profile.overall_mastery = 0.0;
    } else {
      const avgMastery = masteryValues.reduce((sum, level) => sum + level, 0) / masteryValues.length;
      profile.overallMastery = avgMastery;
      profile.overall_mastery = avgMastery;
    }
    
    // Update aggregate metrics
    profile.aggregateMetrics = {
      overallMastery: profile.overallMastery,
      completedKCs: masteryValues.filter(level => level >= 0.85).length,
      totalKCsAttempted: masteryValues.length
    };
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    console.log('🔍 MockProfileService: getKCMastery', { userId, kcId });
    const profile = this.getOrCreateProfileSync(userId);
    return profile.kcMasteryMap?.[kcId] || null;
  }

  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return this.getLearnerProfile(userId);
  }

  async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    console.log('⚙️ MockProfileService: updateUserPreferences', { userId, preferences });
    const profile = this.getOrCreateProfileSync(userId);
    profile.preferences = { ...profile.preferences, ...preferences };
    profile.updated_at = new Date().toISOString();
    profile.lastUpdatedTimestamp = Date.now();
  }

  getStoreSize(): number {
    return profileStore.size;
  }

  resetStore(): void {
    console.log('🧹 MockProfileService: resetStore');
    profileStore.clear();
  }
}

// Ensure a single instance is exported for consistent mocking and usage
export const mockProfileService = new MockProfileService();