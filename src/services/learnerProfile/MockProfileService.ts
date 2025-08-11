// @ts-nocheck

import {
  LearnerProfile,
  KnowledgeComponentMastery,
  LearnerPreferences,
  KCMasteryUpdateData
} from '@/types/learnerProfile';

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

const DEFAULT_PREFERENCES: LearnerPreferences = {
  preferredSubjects: ['Mathematics'],
  learningStyle: 'mixed',
  difficultyPreference: 0.5,
  sessionLength: 30,
};

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
        overall_mastery: 0.0,
        kc_masteries: [],
        kcMasteryMap: {},
        preferences: { ...DEFAULT_PREFERENCES },
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
