
import { useState, useCallback } from 'react';

interface DifficultyMetrics {
  currentLevel: number;
  recommendedLevel: number;
  confidenceScore: number;
  adaptationReason: string;
  lastUpdated: string;
}

interface DifficultyRecommendation {
  type: 'increase' | 'decrease' | 'maintain';
  message: string;
}

export const useAdaptiveDifficulty = (subject: string, skillArea: string) => {
  const [difficultyMetrics, setDifficultyMetrics] = useState<DifficultyMetrics>({
    currentLevel: 3,
    recommendedLevel: 3,
    confidenceScore: 0.75,
    adaptationReason: 'Initial assessment level',
    lastUpdated: new Date().toISOString()
  });

  const getDifficultyRecommendation = useCallback((): DifficultyRecommendation => {
    const { currentLevel, recommendedLevel } = difficultyMetrics;
    
    if (recommendedLevel > currentLevel) {
      return {
        type: 'increase',
        message: `AI recommends increasing difficulty to level ${recommendedLevel} based on your performance`
      };
    } else if (recommendedLevel < currentLevel) {
      return {
        type: 'decrease',
        message: `AI recommends decreasing difficulty to level ${recommendedLevel} for better learning`
      };
    } else {
      return {
        type: 'maintain',
        message: `Current difficulty level ${currentLevel} is optimal for your learning`
      };
    }
  }, [difficultyMetrics]);

  const applyDifficultyAdjustment = useCallback(() => {
    setDifficultyMetrics(prev => ({
      ...prev,
      currentLevel: prev.recommendedLevel,
      adaptationReason: 'Manual adjustment applied',
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  return {
    difficultyMetrics,
    getDifficultyRecommendation,
    applyDifficultyAdjustment
  };
};
