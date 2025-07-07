
// Mock Profile Service with proper exports

import { LearnerProfile, KnowledgeComponentMastery } from '@/types/learnerProfile';

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
}

export const mockProfileService = MockProfileService;
