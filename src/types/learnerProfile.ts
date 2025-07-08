
// src/types/learnerProfile.ts

/**
 * Data structure for updating Knowledge Component mastery,
 * typically derived from a stealth assessment event (e.g., QuestionInteractionEvent from stealthAssessment.ts).
 */
export interface KCMasteryUpdateData {
  success: boolean;
  /** Number of attempts within the specific interaction/session that this data point refers to.
   *  For a single question answer, this would usually be 1 from the perspective of the KC.
   */
  attemptsInInteraction?: number;
  timeTakenMs?: number;
  hintsUsed?: number;
  timestamp: string; // ISO string from the richer stealth assessment event
  eventType?: string; // e.g., 'answer_submitted', 'hint_used', to be stored in the simpler local InteractionEvent history
  details?: any; // To store other parts of the payload from the richer event
}

export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number; // 0.0 to 1.0
  attempts: number;
  correctAttempts: number;
  lastAttemptTimestamp: number;
  history: InteractionEvent[];
}

// Type alias for backward compatibility
export type KcMastery = KnowledgeComponentMastery;

export interface InteractionEvent {
  timestamp: number;
  eventType: string;
  score: number;
  details?: any;
}

// Add the missing type that was being imported
export type KcMasteryHistoryItem = InteractionEvent;

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
