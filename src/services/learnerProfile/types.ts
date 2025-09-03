/* @ts-nocheck */

// src/services/learnerProfile/types.ts

import { LearnerProfile, KnowledgeComponentMastery } from '@/types/learnerProfile';

export interface LearnerProfileService {
  /**
   * Retrieves a learner profile by user ID
   */
  getProfile(userId: string): Promise<LearnerProfile | null>;

  /**
   * Updates KC mastery based on performance data
   */
  updateKcMastery(userId: string, kcId: string, masteryUpdate: {
    isCorrect: boolean;
    newAttempt: boolean;
    interactionType: string;
    interactionDetails?: any;
  }): Promise<LearnerProfile>;

  /**
   * Gets specific KC mastery data
   */
  getKcMastery(userId: string, kcId: string): Promise<KnowledgeComponentMastery | null>;

  /**
   * Updates learner preferences
   */
  updatePreferences(userId: string, preferences: Partial<LearnerProfile['preferences']>): Promise<void>;

  /**
   * Creates initial profile for new user
   */
  createInitialProfile(userId: string): Promise<LearnerProfile>;

  /**
   * Updates entire profile
   */
  updateProfile(profile: LearnerProfile): Promise<void>;
}
