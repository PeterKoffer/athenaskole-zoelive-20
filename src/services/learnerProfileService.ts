
// Fixed learner profile service with proper imports

import { SupabaseProfileService } from './learnerProfile/SupabaseProfileService';
import { mockProfileService } from './learnerProfile/MockProfileService';
import type { LearnerProfile } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return await mockProfileService.getLearnerProfile(userId) as LearnerProfile | null;
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    const profile = await mockProfileService.getLearnerProfile(userId);
    return profile as LearnerProfile;
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    console.log('Updating profile:', profile);
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    const profile = await this.getProfile(userId);
    return profile as LearnerProfile;
  }
}

export default new LearnerProfileService();
