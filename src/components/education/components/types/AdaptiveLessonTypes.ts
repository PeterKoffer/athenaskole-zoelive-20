
export interface StudentPerformanceMetrics {
  correctAnswersRatio: number; // 0-1
  averageResponseTime: number; // seconds
  strugglingConcepts: string[];
  masteredConcepts: string[];
  currentDifficultyLevel: number; // 1-10
  engagementLevel: number; // 0-100
  learningPace: 'slow' | 'average' | 'fast';
}

export interface AdaptivePhaseConfig {
  phaseType: string;
  basePercentage: number; // % of total lesson time
  minPercentage: number;
  maxPercentage: number;
  adaptiveFactors: {
    performanceBased: boolean;
    paceBased: boolean;
    engagementBased: boolean;
  };
}

export interface AdaptiveLessonConfig {
  targetTotalMinutes: number;
  phases: AdaptivePhaseConfig[];
  difficultyAdaptation: {
    increaseThreshold: number; // correct ratio to increase difficulty
    decreaseThreshold: number; // correct ratio to decrease difficulty
    maxAdjustmentPerActivity: number;
  };
  paceAdaptation: {
    fastLearnerSpeedup: number; // multiplier for fast learners
    slowLearnerExtension: number; // multiplier for slow learners
  };
}

export interface AdaptiveActivityRequirements {
  minCorrectToAdvance: number;
  maxAttemptsPerActivity: number;
  masteryThreshold: number; // % correct needed to consider mastered
}
