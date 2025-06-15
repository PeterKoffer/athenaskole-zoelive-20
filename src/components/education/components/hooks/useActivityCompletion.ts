
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
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(currentActivityIndex)) {
        newSet.add(currentActivityIndex);
        console.log('✅ Activity completed (marked):', currentActivityIndex, Array.from(newSet));
      }
      return newSet;
    });
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }
    const nextIndex = currentActivityIndex + 1;
    const hasMoreActivities = nextIndex < allActivitiesLength;
    const hasReachedTimeLimit = timeElapsed >= 1200;
    if (!hasMoreActivities || hasReachedTimeLimit) {
      console.log('🎓 Lesson completed! (handleActivityComplete)');
      onLessonComplete();
    } else {
      console.log('➡️ Advancing to next activity:', nextIndex);
      setCurrentActivityIndex(nextIndex);
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
