
import { useState, useCallback } from 'react';

export interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  totalAttempts: number;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    accuracy: 0,
    averageTime: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    totalAttempts: 0
  });

  const recordAnswer = useCallback((isCorrect: boolean, responseTime: number) => {
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        consecutiveCorrect: isCorrect ? prev.consecutiveCorrect + 1 : 0,
        consecutiveIncorrect: isCorrect ? 0 : prev.consecutiveIncorrect + 1,
      };

      // Calculate new accuracy
      const totalCorrect = isCorrect 
        ? (prev.accuracy * prev.totalAttempts / 100) + 1
        : (prev.accuracy * prev.totalAttempts / 100);
      
      newMetrics.accuracy = (totalCorrect / newMetrics.totalAttempts) * 100;

      // Calculate average response time
      newMetrics.averageTime = prev.averageTime === 0 
        ? responseTime 
        : (prev.averageTime * (newMetrics.totalAttempts - 1) + responseTime) / newMetrics.totalAttempts;

      return newMetrics;
    });
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      accuracy: 0,
      averageTime: 0,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalAttempts: 0
    });
  }, []);

  return {
    metrics,
    recordAnswer,
    resetMetrics
  };
};
