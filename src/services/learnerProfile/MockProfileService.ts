
// src/services/learnerProfile/MockProfileService.ts

import { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences } from '@/types/learnerProfile';

export const MOCK_USER_ID = '12345678-1234-5678-9012-123456789012';

export class MockProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    console.log(`🔍 MockProfileService: Getting profile for user ${userId}`);
    
    // Return a mock profile for testing
    const mockKcMasteryMap: Record<string, KnowledgeComponentMastery> = {
      'add_fractions_likedenom': {
        kcId: 'add_fractions_likedenom',
        masteryLevel: 0.6,
        attempts: 5,
        correctAttempts: 3,
        lastAttemptTimestamp: Date.now() - 86400000, // 1 day ago
        history: []
      }
    };

    const mockPreferences: LearnerPreferences = {
      learningStyle: 'mixed',
      difficultyPreference: 0.5,
      sessionLength: 20
    };

    const mockProfile: LearnerProfile = {
      userId: userId,
      kcMasteryMap: mockKcMasteryMap,
      preferences: mockPreferences,
      recentPerformance: [],
      overallMastery: 0.6,
      lastUpdatedTimestamp: Date.now(),
      createdAt: Date.now() - 7 * 86400000 // 7 days ago
    };

    console.log(`✅ MockProfileService: Returning mock profile for user ${userId}`);
    return mockProfile;
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log(`🔄 MockProfileService: Mock update for user ${profile.userId}`);
    // In a real implementation, this would persist the changes
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    console.log(`🆕 MockProfileService: Creating initial profile for user ${userId}`);
    return this.getProfile(userId) as Promise<LearnerProfile>;
  }
}

export const mockProfileService = new MockProfileService();
