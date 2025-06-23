
import { UserProgress } from '@/services/progressPersistence';

export const calculateRecommendedSessionTime = (userProgress: UserProgress | null): number => {
  if (!userProgress) return 20; // Default 20 minutes
  
  // Use accuracy_rate instead of accuracy
  const accuracy = userProgress.accuracy_rate || userProgress.accuracy || 0;
  const attempts = userProgress.attempts_count || userProgress.attempts || 0;
  
  if (accuracy > 80) {
    return 25; // Longer sessions for high performers
  } else if (accuracy < 50) {
    return 15; // Shorter sessions for struggling learners
  }
  
  return 20; // Default
};

export const shouldAdjustDifficulty = (userProgress: UserProgress | null, currentStreak: number): boolean => {
  if (!userProgress) return false;
  
  const accuracy = userProgress.accuracy_rate || userProgress.accuracy || 0;
  
  // Adjust difficulty if accuracy is very high or very low
  return accuracy > 90 || accuracy < 40;
};

export const calculateDifficultyAdjustment = (userProgress: UserProgress | null, isCorrect: boolean): number => {
  if (!userProgress) return 0;
  
  const accuracy = userProgress.accuracy_rate || userProgress.accuracy || 0;
  
  if (isCorrect && accuracy > 85) {
    return 0.1; // Increase difficulty
  } else if (!isCorrect && accuracy < 50) {
    return -0.1; // Decrease difficulty
  }
  
  return 0; // No change
};
