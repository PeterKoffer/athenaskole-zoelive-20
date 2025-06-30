
import SupabaseProfileService from './learnerProfile/SupabaseProfileService';
import type { LearnerProfile } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return await SupabaseProfileService.getProfile(userId);
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    return await SupabaseProfileService.createInitialProfile(userId);
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    return await SupabaseProfileService.updateProfile(profile);
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    // For now, delegate to the LearnerProfileService which has this method
    const LearnerProfileServiceInstance = await import('./learnerProfile/LearnerProfileService');
    return await LearnerProfileServiceInstance.default.updateKcMastery(userId, kcId, masteryUpdate);
  }
}

export default new LearnerProfileService();
