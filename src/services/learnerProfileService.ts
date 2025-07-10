
// Fixed learner profile service with proper imports

import { SupabaseProfileService } from './learnerProfile/SupabaseProfileService';

const profileService = new SupabaseProfileService();
import type { LearnerProfile } from '@/types/learnerProfile';

class LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    return await profileService.getProfile(userId);
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    const profile = await profileService.getProfile(userId);
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
