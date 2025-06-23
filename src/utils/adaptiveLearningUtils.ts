
import { UserProgress } from '@/services/progressPersistence';

export const calculateRecommendedSessionTime = (userProgress: UserProgress | null): number => {
  if (!userProgress) return 20; // Default 20 minutes for new users

  // Use correct property names from UserProgress interface
  const { accuracy, attempts } = userProgress;
  
  // Base time on past performance
  let recommendedTime = 20;

  // Adjust based on accuracy
  if (accuracy > 80) {
    recommendedTime += 5; // Longer sessions for high performers
  } else if (accuracy < 60) {
    recommendedTime -= 5; // Shorter sessions for struggling learners
  }

  // Adjust based on experience
  if (attempts > 10) {
    recommendedTime += 5; // Experienced learners can handle longer sessions
  }

  return Math.max(10, Math.min(40, recommendedTime)); // Between 10-40 minutes
};

export const shouldAdjustDifficulty = (
  accuracy: number,
  consecutiveCorrect: number,
  consecutiveIncorrect: number,
  totalAttempts: number
): { shouldAdjust: boolean; newLevel?: number; reason?: string } => {
  // Don't adjust until we have enough data
  if (totalAttempts < 3) return { shouldAdjust: false };

  // Increase difficulty conditions
  if (accuracy >= 85 && consecutiveCorrect >= 3) {
    return {
      shouldAdjust: true,
      newLevel: 1, // relative increase
      reason: `High accuracy (${accuracy.toFixed(1)}%) - increasing difficulty`
    };
  }

  if (accuracy >= 90 && consecutiveCorrect >= 2) {
    return {
      shouldAdjust: true,
      newLevel: 1,
      reason: `Excellent performance (${accuracy.toFixed(1)}%) - increasing difficulty`
    };
  }

  // Decrease difficulty conditions
  if (accuracy <= 50 && consecutiveIncorrect >= 2) {
    return {
      shouldAdjust: true,
      newLevel: -1, // relative decrease
      reason: `Low accuracy (${accuracy.toFixed(1)}%) - decreasing difficulty`
    };
  }

  if (accuracy <= 30) {
    return {
      shouldAdjust: true,
      newLevel: -1,
      reason: `Very low accuracy (${accuracy.toFixed(1)}%) - decreasing difficulty`
    };
  }

  return { shouldAdjust: false };
};
