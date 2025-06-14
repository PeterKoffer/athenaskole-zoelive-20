
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
  
  // Generate daily lessons with dynamic extension
  const {
    allActivities,
    isLoadingActivities,
    regenerateLesson,
    extendLessonDynamically,
    isExtending,
    targetDuration,
    usedQuestionIds
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

  // Handle lesson actions with dynamic extension
  const {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete: baseHandleActivityComplete,
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

  // Enhanced activity completion with dynamic extension
  const handleActivityComplete = React.useCallback((wasCorrect?: boolean) => {
    // Call base handler first
    baseHandleActivityComplete(wasCorrect);
    
    // Check if we should extend the lesson
    const timeElapsedMinutes = Math.floor(sessionTimer / 60);
    const engagementLevel = 85; // You can calculate this based on performance
    
    // Trigger extension check after a short delay to allow state updates
    setTimeout(() => {
      extendLessonDynamically(
        sessionTimer,
        lessonState.score,
        correctStreak,
        engagementLevel
      );
    }, 1000);
  }, [baseHandleActivityComplete, sessionTimer, lessonState.score, correctStreak, extendLessonDynamically]);

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
    isLoadingActivities: isLoadingActivities || isExtending,
    regenerateLesson,
    
    // Dynamic extension properties
    targetDuration,
    isExtending,
    usedQuestionCount: usedQuestionIds
  };

  return (
    <UnifiedLessonContext.Provider value={contextValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};
