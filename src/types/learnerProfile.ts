
// src/types/learnerProfile.ts

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
