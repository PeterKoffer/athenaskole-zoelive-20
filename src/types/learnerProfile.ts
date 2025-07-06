
// src/types/learnerProfile.ts

export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number; // 0.0 to 1.0, representing probability of mastery
  attempts: number;
  correctAttempts: number;
  lastAttemptTimestamp: number;
  history: InteractionEvent[];
}

// Type alias for backward compatibility
export type KcMastery = KnowledgeComponentMastery;

export interface InteractionEvent {
  timestamp: number;
  eventType: string; // 'practice', 'assessment', 'hint_used', etc.
  score: number; // 0.0 to 1.0
  details?: any; // Additional context-specific data
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
  recentPerformance: number[]; // Last N session performance scores
  overallMastery: number; // Aggregate mastery level across all KCs
  lastUpdatedTimestamp: number;
  createdAt: number;
}
