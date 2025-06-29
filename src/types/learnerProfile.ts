
export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number; // 0.0 to 1.0
  attempts: number;
  correctAttempts: number;
  lastAttemptTimestamp: number;
  history: InteractionEvent[];
}

export interface InteractionEvent {
  timestamp: number;
  eventType: string;
  score?: number;
  details?: any;
}

export interface LearnerPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number; // 0.0 to 1.0
  sessionLength: number; // preferred minutes
}

export interface LearnerProfile {
  userId: string;
  kcMasteryMap: Record<string, KnowledgeComponentMastery>;
  preferences: LearnerPreferences;
  recentPerformance: InteractionEvent[];
  overallMastery: number;
  lastUpdatedTimestamp: number;
  createdAt: number;
}
