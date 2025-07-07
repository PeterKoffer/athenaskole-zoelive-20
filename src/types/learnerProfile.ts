
// Learner Profile Types

export interface KcMastery {
  kc_id: string;
  mastery_level: number;
  confidence: number;
  last_updated: string;
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
  user_id: string;
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
