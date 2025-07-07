
// Mock Profile Service with proper exports

import { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';
import { mockLearnerProfileService } from './MockLearnerProfileService';

export const MOCK_USER_ID = 'mock-user-12345';

export class MockProfileService {
  static async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    console.log('👤 MockProfileService: getLearnerProfile');
    
    return {
      userId,
      preferences: {
        preferredSubjects: ['Mathematics'],
        learningStyle: 'visual',
        difficultyPreference: 3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async getKnowledgeComponentMastery(userId: string): Promise<any[]> {
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

  // Delegate to the main service for test methods
  static async updateKCMastery(userId: string, kcId: string, performance: any): Promise<void> {
    return mockLearnerProfileService.updateKCMastery(userId, kcId, performance);
  }

  static async getKCMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    return mockLearnerProfileService.getKCMastery(userId, kcId);
  }

  static async getProfile(userId: string): Promise<LearnerProfile | null> {
    return mockLearnerProfileService.getProfile(userId);
  }

  static async updateUserPreferences(userId: string, preferences: Partial<LearnerPreferences>): Promise<void> {
    return mockLearnerProfileService.updatePreferences(userId, preferences);
  }

  static getStoreSize(): number {
    return mockLearnerProfileService.getStoreSize();
  }

  static resetStore(): void {
    mockLearnerProfileService.resetStore();
  }
}

export const mockProfileService = MockProfileService;
export const mockLearnerProfileService = mockLearnerProfileService;
