
import { useState, useCallback, useRef } from 'react';
import { LessonActivity } from '../components/types/LessonTypes';

interface UseActivityProgressionProps {
  allActivities: LessonActivity[];
  onActivityComplete?: (wasCorrect?: boolean) => void;
  onLessonComplete?: () => void;
}

export const useActivityProgression = ({
  allActivities,
  onActivityComplete,
  onLessonComplete
}: UseActivityProgressionProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const progressionRef = useRef<NodeJS.Timeout | null>(null);

  const currentActivity = allActivities[currentActivityIndex] || null;

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    const responseTime = Date.now();
    setLastResponseTime(responseTime);

    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Clear any existing progression timer
    if (progressionRef.current) {
      clearTimeout(progressionRef.current);
    }

    // Call the external handler
    if (onActivityComplete) {
      onActivityComplete(wasCorrect);
    }

    // Schedule progression to next activity
    progressionRef.current = setTimeout(() => {
      if (currentActivityIndex < allActivities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        if (onLessonComplete) {
          onLessonComplete();
        }
      }
    }, wasCorrect !== undefined ? 2500 : 1500);
  }, [currentActivityIndex, allActivities.length, onActivityComplete, onLessonComplete]);

  const moveToNextActivity = useCallback(() => {
    if (currentActivityIndex < allActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    }
  }, [currentActivityIndex, allActivities.length]);

  const resetProgression = useCallback(() => {
    setCurrentActivityIndex(0);
    setCorrectStreak(0);
    setLastResponseTime(0);
    if (progressionRef.current) {
      clearTimeout(progressionRef.current);
    }
  }, []);

  return {
    currentActivityIndex,
    currentActivity,
    correctStreak,
    lastResponseTime,
    handleActivityComplete,
    moveToNextActivity,
    resetProgression,
    setCurrentActivityIndex,
    setCorrectStreak,
    setLastResponseTime
  };
};
