
// Main Supabase service implementing LearnerProfileService interface
import type { LearnerProfile, KnowledgeComponentMastery, LearnerPreferences, KCMasteryUpdateData } from '@/types/learnerProfile';
import type { LearnerProfileService } from './types';
import { SupabaseProfileRepository } from './repositories/SupabaseProfileRepository';
import { SupabaseKCMasteryRepository } from './repositories/SupabaseKCMasteryRepository';
import { ProfileDataTransformers } from './utils/profileDataTransformers';

export class SupabaseProfileService implements LearnerProfileService {
  async getProfile(userId: string): Promise<LearnerProfile | null> {
    try {
      console.log('👤 Getting learner profile for user:', userId);
      
      // Get profile and KC data in parallel
      const [profileData, kcData] = await Promise.all([
        SupabaseProfileRepository.getProfileData(userId),
        SupabaseKCMasteryRepository.getKCMasteryData(userId)
      ]);

      if (!profileData) {
        return null;
      }

      // Transform data to LearnerProfile format
      const learnerProfile = ProfileDataTransformers.transformToLearnerProfile(profileData, kcData || []);

      console.log('✅ Learner profile retrieved successfully');
      return learnerProfile;
    } catch (error) {
      console.error('❌ Exception getting learner profile:', error);
      return null;
    }
  }

  async updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile> {
    // Convert interface format to KCMasteryUpdateData format
    const masteryData: KCMasteryUpdateData = {
      success: masteryUpdate.isCorrect,
      attemptsInInteraction: masteryUpdate.newAttempt ? 1 : 0,
      timeTakenMs: masteryUpdate.interactionDetails?.timeTakenMs,
      hintsUsed: masteryUpdate.interactionDetails?.hintsUsed,
      timestamp: new Date().toISOString(),
      eventType: masteryUpdate.interactionType,
      details: masteryUpdate.interactionDetails
    };

    await SupabaseKCMasteryRepository.updateKnowledgeComponentMastery(userId, kcId, masteryData);
    
    // Return updated profile
    const profile = await this.getProfile(userId);
    return profile!;
  }

  async getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null> {
    const masteries = await SupabaseKCMasteryRepository.getKnowledgeComponentMastery(userId);
    return masteries.find(m => m.kcId === kcId) || null;
  }

  async updatePreferences(userId: string, preferences: Partial<LearnerProfile['preferences']>): Promise<void> {
    await SupabaseProfileRepository.updateLearnerProfile(userId, { preferences: preferences as any });
  }

  async createInitialProfile(userId: string): Promise<LearnerProfile> {
    const defaultPreferences: LearnerPreferences = {
      preferredSubjects: [],
      learningStyle: 'visual',
      difficultyPreference: 3,
      sessionLength: 30
    };

    await SupabaseProfileRepository.createLearnerProfile(userId, defaultPreferences);
    
    const profile = await this.getProfile(userId);
    return profile!;
  }

  async updateProfile(profile: LearnerProfile): Promise<void> {
    await SupabaseProfileRepository.updateLearnerProfile(profile.userId, profile);
  }

  // Legacy static methods for backward compatibility
  static async createLearnerProfile(userId: string, preferences: LearnerPreferences): Promise<boolean> {
    return SupabaseProfileRepository.createLearnerProfile(userId, preferences);
  }

  static async updateLearnerProfile(userId: string, updates: Partial<LearnerProfile>): Promise<boolean> {
    return SupabaseProfileRepository.updateLearnerProfile(userId, updates);
  }

  static async getLearnerProfile(userId: string): Promise<LearnerProfile | null> {
    const service = new SupabaseProfileService();
    return service.getProfile(userId);
  }

  static async getKnowledgeComponentMastery(userId: string): Promise<KnowledgeComponentMastery[]> {
    return SupabaseKCMasteryRepository.getKnowledgeComponentMastery(userId);
  }

  static async updateKnowledgeComponentMastery(
    userId: string,
    kcId: string,
    masteryData: KCMasteryUpdateData
  ): Promise<boolean> {
    return SupabaseKCMasteryRepository.updateKnowledgeComponentMastery(userId, kcId, masteryData);
  }

  static async recordLearningInteraction(userId: string, interactionData: any): Promise<boolean> {
    return SupabaseProfileRepository.recordLearningInteraction(userId, interactionData);
  }
}

export default SupabaseProfileService;
