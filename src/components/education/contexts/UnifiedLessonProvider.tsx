
import React from 'react';
import { UnifiedLessonContext } from './UnifiedLessonContext';
import { useDailyLessonGeneration } from './hooks/useDailyLessonGeneration';
import { useUnifiedLessonState } from './hooks/useUnifiedLessonState';
import { useUnifiedLessonActions } from './hooks/useUnifiedLessonActions';
import { UnifiedLessonProviderProps, UnifiedLessonContextType } from './types/UnifiedLessonTypes';

export const UnifiedLessonProvider = ({ 
  children, 
  subject, 
  allActivities: staticActivities = [], 
  onLessonComplete,
  skillArea = 'general',
  gradeLevel = 6
}: UnifiedLessonProviderProps) => {
  
  // Generate daily lessons
  const {
    allActivities,
    isLoadingActivities,
    regenerateLesson
  } = useDailyLessonGeneration({
    subject,
    skillArea,
    gradeLevel,
    staticActivities
  });

  // Manage lesson state
  const {
    currentActivityIndex,
    setCurrentActivityIndex,
    correctStreak,
    currentActivity,
    lessonState,
    sessionTimer,
    lessonStartTime,
    isTimerActive,
    updatePhase,
    updateScore,
    updateProgress,
    completeLesson,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  } = useUnifiedLessonState({
    allActivities,
    onLessonComplete
  });

  // Handle lesson actions
  const {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest
  } = useUnifiedLessonActions({
    subject,
    sessionTimer,
    correctStreak,
    score: lessonState.score,
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
  });

  const contextValue: UnifiedLessonContextType = {
    // Lesson state
    currentActivityIndex,
    allActivities,
    currentActivity,
    phase: lessonState.phase,
    
    // Progress tracking
    sessionTimer,
    score: lessonState.score,
    correctStreak,
    isTimerActive,
    lessonStartTime,
    
    // Compatibility properties
    timeSpent: sessionTimer,
    currentSegment: currentActivityIndex,
    totalSegments: allActivities.length,
    
    // Actions
    handleActivityComplete,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleReadRequest,
    
    // Loading states
    isLoadingActivities,
    regenerateLesson
  };

  return (
    <UnifiedLessonContext.Provider value={contextValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};
