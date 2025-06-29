// src/types/learnerProfile.ts

import { KnowledgeComponent } from './knowledgeComponent';

/**
 * Represents the mastery level of a specific Knowledge Component for a learner.
 */
export interface KcMastery {
  kcId: string; // Identifier of the Knowledge Component
  masteryLevel: number; // A numerical representation of mastery (e.g., 0.0 to 1.0)
  attempts: number; // Total number of attempts related to this KC
  correctAttempts: number; // Number of successful attempts
  lastAttemptedTimestamp?: number; // Timestamp of the last interaction with this KC
  // Future: Could include BKT parameters (L0, G, S, T) or IRT theta estimates
  history?: Array<{ timestamp: number; eventType: string; score?: number; details?: any }>; // Brief history of interactions
}

/**
 * Represents the overall learning profile for a student.
 * This is the "Dynamic Learner Fingerprint".
 */
export interface LearnerProfile {
  userId: string; // The ID of the user this profile belongs to
  kcMasteryMap: Record<string, KcMastery>; // A map of KC IDs to their mastery objects
  overallMastery?: number; // An aggregated mastery score across all relevant KCs (optional)
  currentLearningFocusKcs?: string[]; // KCs currently being focused on
  suggestedNextKcs?: string[]; // KCs suggested for next learning steps
  preferences?: {
    learningPace?: 'slow' | 'medium' | 'fast';
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'; // As per NELIE vision
    preferredLanguage?: string; // e.g., "en-US", "da-DK"
    activeCurriculumContext?: string; // e.g., "US_CCSS", "DK_FM_Matematik_4kl", or a specific curriculum ID
    // Other preferences can be added here
  };
  lastUpdatedTimestamp: number; // Timestamp of the last profile update
  // Future: Could include engagement metrics, emotional state indicators (from vision)
}

/**
 * Interface for the service that manages Learner Profiles.
 */
export interface ILearnerProfileService {
  /**
   * Retrieves the Learner Profile for a given user.
   * If a profile doesn't exist, it might create a new one with default values.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the LearnerProfile.
   */
  getProfile(userId: string): Promise<LearnerProfile>;

  /**
   * Updates the mastery level for a specific KC in a user's profile.
   * This would typically be called after a stealth assessment event.
   * @param userId The ID of the user.
   * @param kcId The ID of the Knowledge Component.
   * @param eventDetails Details from the interaction event (e.g., isCorrect, attempts).
   * @returns A Promise that resolves to the updated LearnerProfile.
   */
  updateKcMastery(
    userId: string,
    kcId: string,
    eventDetails: {
      isCorrect?: boolean;
      newAttempt?: boolean;
      score?: number; // e.g., for games or partial credit
      interactionType: string; // From InteractionEventType
      interactionDetails?: any;
    }
  ): Promise<LearnerProfile>;

  /**
   * Updates multiple KC mastery levels, e.g., after a complex activity.
   * @param userId The ID of the user.
   * @param updates An array of KC IDs and their corresponding event details.
   * @returns A Promise that resolves to the updated LearnerProfile.
   */
  batchUpdateKcMastery(
    userId: string,
    updates: Array<{
      kcId: string;
      eventDetails: {
        isCorrect?: boolean;
        newAttempt?: boolean;
        score?: number;
        interactionType: string;
        interactionDetails?: any;
      };
    }>
  ): Promise<LearnerProfile>;


  /**
   * Retrieves the mastery level for a specific KC.
   * @param userId The ID of the user.
   * @param kcId The ID of the Knowledge Component.
   * @returns A Promise that resolves to the KcMastery object or undefined.
   */
  getKcMastery(userId: string, kcId: string): Promise<KcMastery | undefined>;

  /**
   * Updates learner preferences.
   * @param userId The ID of the user.
   * @param preferences Partial object of preferences to update.
   * @returns A Promise that resolves to the updated LearnerProfile.
   */
  updatePreferences(
    userId: string,
    preferences: Partial<LearnerProfile['preferences']>
  ): Promise<LearnerProfile>;

  /**
   * Recommends the next KCs for the learner based on their current profile.
   * (Placeholder for more complex logic involving prerequisites, goals, etc.)
   * @param userId The ID of the user.
   * @param count The number of KCs to recommend.
   * @returns A Promise that resolves to an array of KnowledgeComponent objects.
   */
  recommendNextKcs(userId: string, count: number): Promise<KnowledgeComponent[]>;

  // Future:
  // resetProfile(userId: string): Promise<LearnerProfile>;
  // exportProfile(userId: string): Promise<any>; // Export data for analysis
  // importProfile(userId: string, profileData: any): Promise<LearnerProfile>;
}
