
import { useCallback } from 'react';
import { useLessonActions } from './useLessonActions';
import { LessonActivity } from '../../components/types/LessonTypes';
import { LessonPhase } from '../types/UnifiedLessonTypes';

interface UseUnifiedLessonActionsProps {
  subject: string;
  sessionTimer: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
  currentActivity: LessonActivity | null;
  currentActivityIndex: number;
  allActivities: LessonActivity[];
  setCurrentActivityIndex: (value: React.SetStateAction<number>) => void;
  updatePhase: (phase: LessonPhase) => void;
  updateScore: (scoreUpdate: number | ((prev: number) => number)) => void;
  completeLesson: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  onLessonComplete: () => void;
}

export const useUnifiedLessonActions = ({
  subject,
  sessionTimer,
  correctStreak,
  score,
  lessonStartTime,
  currentActivity,
  currentActivityIndex,
  allActivities,
  setCurrentActivityIndex,
  updatePhase,
  updateScore,
  completeLesson,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  onLessonComplete
}: UseUnifiedLessonActionsProps) => {
  
  // Handle activity completion
  const handleActivityCompleteBase = useCallback((wasCorrect?: boolean) => {
    if (currentActivityIndex < allActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      // Lesson completed
      setTimeout(() => {
        updatePhase('completed');
        stopTimer();
        onLessonComplete();
      }, 2000);
    }
  }, [currentActivityIndex, allActivities.length, setCurrentActivityIndex, updatePhase, stopTimer, onLessonComplete]);

  // Initialize lesson actions
  const {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest
  } = useLessonActions({
    subject,
    sessionTimer,
    correctStreak,
    score,
    lessonStartTime,
    currentActivity,
    updatePhase,
    updateScore,
    completeLesson,
    handleActivityCompleteBase,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  });

  return {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest
  };
};
