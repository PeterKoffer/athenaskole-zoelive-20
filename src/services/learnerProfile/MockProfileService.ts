
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
      preferences: {
        preferredSubjects: ['Mathematics'],
        learningStyle: 'visual',
        difficultyPreference: 3
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

export const mockProfileService = new MockProfileService();
