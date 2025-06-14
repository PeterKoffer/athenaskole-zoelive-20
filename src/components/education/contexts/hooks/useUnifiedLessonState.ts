
import { useState } from 'react';
import { useLessonStateManager } from '../../hooks/useLessonStateManager';
import { useLessonTimer } from '../../hooks/useLessonTimer';
import { LessonActivity } from '../../components/types/LessonTypes';

interface UseUnifiedLessonStateProps {
  allActivities: LessonActivity[];
  onLessonComplete: () => void;
}

export const useUnifiedLessonState = ({
  allActivities,
  onLessonComplete
}: UseUnifiedLessonStateProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Initialize lesson state management
  const {
    lessonState,
    updatePhase,
    updateScore,
    updateProgress,
    completeLesson
  } = useLessonStateManager({
    totalSegments: allActivities.length,
    onLessonComplete
  });

  // Initialize timer
  const {
    sessionTimer,
    lessonStartTime,
    isTimerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  } = useLessonTimer();

  // Get current activity
  const currentActivity = allActivities[currentActivityIndex] || null;

  return {
    // State
    currentActivityIndex,
    setCurrentActivityIndex,
    correctStreak,
    setCorrectStreak,
    currentActivity,
    lessonState,
    sessionTimer,
    lessonStartTime,
    isTimerActive,
    
    // Actions
    updatePhase,
    updateScore,
    updateProgress,
    completeLesson,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  };
};
