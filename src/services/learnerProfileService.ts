
import SupabaseProfileService from './learnerProfile/SupabaseProfileService';
import { mockLearnerProfileService } from './learnerProfile/MockLearnerProfileService';
import type { LearnerProfile } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    // For now, use the mock service. Later we can switch based on environment or config
    return await mockLearnerProfileService.getProfile(userId);
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    return await mockLearnerProfileService.createInitialProfile(userId);
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    return await mockLearnerProfileService.updateProfile(profile);
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    return await mockLearnerProfileService.updateKcMastery(userId, kcId, masteryUpdate);
  }
}

export default new LearnerProfileService();
