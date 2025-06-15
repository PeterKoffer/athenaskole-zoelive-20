
import { useCallback } from 'react';

type UseActivityCompletionProps = {
  currentActivityIndex: number;
  allActivitiesLength: number;
  timeElapsed: number;
  onLessonComplete: () => void;
  setCompletedActivities: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentActivityIndex: (index: number) => void;
  setCorrectStreak: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

export const useActivityCompletion = ({
  currentActivityIndex,
  allActivitiesLength,
  timeElapsed,
  onLessonComplete,
  setCompletedActivities,
  setCurrentActivityIndex,
  setCorrectStreak,
  setScore
}: UseActivityCompletionProps) => {
  return useCallback((wasCorrect?: boolean) => {
    console.log('🎯 Activity completion triggered:', {
      currentActivityIndex,
      wasCorrect,
      allActivitiesLength,
      timeElapsed
    });

    // Mark current activity as completed
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(currentActivityIndex)) {
        newSet.add(currentActivityIndex);
        console.log('✅ Activity marked as completed:', currentActivityIndex, Array.from(newSet));
      }
      return newSet;
    });

    // Update score and streak
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
        console.log('🎉 Correct answer! Updating score and streak');
      } else {
        setCorrectStreak(0);
        console.log('❌ Incorrect answer, resetting streak');
      }
    }

    const nextIndex = currentActivityIndex + 1;
    const hasMoreActivities = nextIndex < allActivitiesLength;
    const hasReachedTimeLimit = timeElapsed >= 1200; // 20 minutes

    console.log('🔍 Checking progression:', {
      nextIndex,
      hasMoreActivities,
      hasReachedTimeLimit,
      shouldAdvance: hasMoreActivities && !hasReachedTimeLimit
    });

    if (!hasMoreActivities || hasReachedTimeLimit) {
      console.log('🎓 Lesson completed! (handleActivityComplete)');
      onLessonComplete();
    } else {
      console.log('➡️ Advancing to next activity:', nextIndex);
      // Force immediate advancement
      setTimeout(() => {
        setCurrentActivityIndex(nextIndex);
        console.log('✅ Advanced to activity:', nextIndex);
      }, 100);
    }
  }, [
    currentActivityIndex,
    allActivitiesLength,
    timeElapsed,
    onLessonComplete,
    setCompletedActivities,
    setCurrentActivityIndex,
    setCorrectStreak,
    setScore
  ]);
};
