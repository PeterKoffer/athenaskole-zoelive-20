
import { ReactNode } from 'react';
import { UnifiedLessonContext } from './UnifiedLessonContext';
import { UnifiedLessonContextProps, UnifiedLessonState } from './types/LessonContextTypes';
import { useTimerManager } from '../hooks/useTimerManager';
import { useLessonStateManager } from '../hooks/useLessonStateManager';
import { useActivityProgression } from '../hooks/useActivityProgression';
import { useLessonActions } from './hooks/useLessonActions';
import { useLessonInitialization } from './hooks/useLessonInitialization';

export const UnifiedLessonProvider = ({
  subject,
  allActivities,
  onLessonComplete,
  children
}: UnifiedLessonContextProps) => {
  const lessonStartTime = Date.now();
  
  // Timer management
  const { 
    timeElapsed: sessionTimer, 
    isActive: isTimerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  } = useTimerManager();

  // Lesson state management
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

  // Activity progression
  const {
    currentActivityIndex,
    currentActivity,
    correctStreak,
    lastResponseTime,
    handleActivityComplete: handleActivityCompleteBase,
    setCurrentActivityIndex,
    setCorrectStreak,
    setLastResponseTime
  } = useActivityProgression({
    allActivities,
    onLessonComplete: completeLesson
  });

  // Lesson actions
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
    correctStreak: correctStreak,
    score: lessonState.score,
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

  // Initialize lesson
  useLessonInitialization({
    phase: lessonState.phase,
    handleLessonStart
  });

  const lessonStateValue: UnifiedLessonState = {
    ...lessonState,
    currentActivityIndex,
    allActivities,
    currentActivity,
    correctStreak,
    lessonStartTime,
    lastResponseTime,
    sessionTimer,
    isTimerActive,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest,
    updateProgress,
    setCurrentActivityIndex,
    setScore: updateScore,
    setCorrectStreak,
    setLastResponseTime
  };

  return (
    <UnifiedLessonContext.Provider value={lessonStateValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};
