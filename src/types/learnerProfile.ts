
// Type definitions for learner profile

export interface LearnerPreferences {
  preferredSubjects: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number;
  sessionLength?: number;
}

export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number;
  practiceCount: number;
  lastAssessed: string;
  totalAttempts?: number;
  successfulAttempts?: number;
  currentStreak?: number;
  interactionHistory?: Array<{
    timestamp: string;
    success: boolean;
    timeTakenSeconds: number;
    hintsUsed: number;
    attempts: number;
    firstAttemptSuccess: boolean;
  }>;
}

export interface LearnerProfile {
  userId: string;
  preferences: LearnerPreferences;
  createdAt: string | number;
  updatedAt?: string;
  lastUpdatedTimestamp?: number;
  kcMastery?: KnowledgeComponentMastery[];
  kcMasteryMap?: Record<string, KnowledgeComponentMastery>;
  recentPerformance?: any[];
  overallMastery?: number;
  aggregateMetrics?: {
    overallMastery: number;
    completedKCs: number;
    totalKCsAttempted: number;
  };
}
