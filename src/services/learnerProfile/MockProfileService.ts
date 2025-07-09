// src/services/learnerProfile/MockProfileService.ts

import {
  LearnerProfile,
  KnowledgeComponentMastery,
  LearnerPreferences,
  KCMasteryUpdateData
} from '@/types/learnerProfile';

export const MOCK_USER_ID = 'mock-user-12345';

export class MockProfileService {
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
    console.log('🧠 MockProfileService: updateKCMastery', { userId, kcId, performance });
  }

  async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    console.log('🔍 MockProfileService: getKCMastery', { userId, kcId });
    return null;
  }

  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return this.getLearnerProfile(userId);
  }

  async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    console.log('⚙️ MockProfileService: updateUserPreferences', { userId, preferences });
  }

  getStoreSize(): number {
    return 1;
  }

  resetStore(): void {
    console.log('🧹 MockProfileService: resetStore');
  }
}

// Ensure a single instance is exported for consistent mocking and usage
export const mockProfileService = new MockProfileService();