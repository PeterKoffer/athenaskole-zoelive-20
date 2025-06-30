
// src/types/learnerProfile.ts

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

// Type alias for backward compatibility
export type KcMastery = KnowledgeComponentMastery;

export interface InteractionEvent {
  timestamp: number;
  eventType: string;
  score: number;
  details?: any;
}

export interface LearnerPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number; // 0.0 to 1.0
  sessionLength: number; // minutes
}

export interface LearnerProfile {
  userId: string;
  kcMasteryMap: Record<string, KnowledgeComponentMastery>;
  preferences: LearnerPreferences;
  recentPerformance: number[];
  overallMastery: number;
  lastUpdatedTimestamp: number;
  createdAt: number;
}
