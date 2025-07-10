
// Learner Profile Types

export interface KcMastery {
  kc_id: string;
  mastery_level: number;
  confidence: number;
  last_updated: string;
}

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
  masteryLevel: number;
  practiceCount: number;
  lastAssessed: string;
  totalAttempts: number;
  successfulAttempts: number;
  currentStreak: number;
  interactionHistory: Array<{
    timestamp: string;
    success: boolean;
    timeTakenSeconds: number;
    hintsUsed: number;
    attempts: number;
    firstAttemptSuccess: boolean;
  }>;
}

export interface LearnerPreferences {
  preferredSubjects: string[];
  learningStyle: string;
  difficultyPreference: number;
  sessionLength: number;
}

export interface LearnerProfile {
  userId: string;
  overall_mastery: number;
  kc_masteries: KcMastery[];
  kcMasteryMap?: Record<string, KnowledgeComponentMastery>;
  preferences: LearnerPreferences;
  created_at: string;
  updated_at: string;
  recentPerformance: any[];
  overallMastery: number;
  lastUpdatedTimestamp: number;
  createdAt: number;
  aggregateMetrics: {
    overallMastery: number;
    completedKCs: number;
    totalKCsAttempted: number;
  };
}
