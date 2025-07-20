
// DEPRECATED: This file has been replaced by UnifiedLessonContext.tsx
// The functionality of this hook has been consolidated into the unified lesson state management
// Please use UnifiedLessonProvider and useUnifiedLesson instead

import { useState, useCallback } from 'react';
import { DEFAULT_DAILY_UNIVERSE_SECONDS } from '@/constants/lesson';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';
export type StandardLessonPhase = 'introduction' | 'content-delivery' | 'interactive-game' | 'application' | 'creative-exploration' | 'summary';

export interface LessonState {
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
  // Enhanced tracking for standardized lessons
  currentActivityPhase?: StandardLessonPhase;
  phaseProgress?: number; // Percentage completion of current phase
  totalLessonTime?: number; // Total lesson duration in seconds
}

export const useLessonStateManager = () => {
  const [lessonState, setLessonState] = useState<LessonState>({
    phase: 'introduction',
    timeSpent: 0,
    currentSegment: 0,
    totalSegments: 6, // Standard lesson structure: 6 phases
    score: 0,
    totalLessonTime: DEFAULT_DAILY_UNIVERSE_SECONDS,
    phaseProgress: 0
  });

  const handleLessonStart = useCallback(() => {
    setLessonState(prev => ({
      ...prev,
      phase: 'lesson',
      currentActivityPhase: 'introduction'
    }));
  }, []);

  const handleLessonPause = useCallback(() => {
    setLessonState(prev => ({
      ...prev,
      phase: 'paused'
    }));
  }, []);

  const handleLessonResume = useCallback(() => {
    setLessonState(prev => ({
      ...prev,
      phase: 'lesson'
    }));
  }, []);

  const handleLessonComplete = useCallback(() => {
    setLessonState(prev => ({
      ...prev,
      phase: 'completed',
      currentActivityPhase: 'summary',
      phaseProgress: 100
    }));
  }, []);

  const updateProgress = useCallback((segment: number, timeSpent: number, score: number) => {
    setLessonState(prev => ({
      ...prev,
      currentSegment: segment,
      timeSpent,
      score,
      phaseProgress: prev.totalLessonTime ? (timeSpent / prev.totalLessonTime) * 100 : 0
    }));
  }, []);

  // Enhanced method for updating current activity phase
  const updateActivityPhase = useCallback((activityPhase: StandardLessonPhase, segment: number) => {
    setLessonState(prev => ({
      ...prev,
      currentActivityPhase: activityPhase,
      currentSegment: segment
    }));
  }, []);

  // Method to calculate phase progress for better UX
  const calculatePhaseProgress = useCallback((currentTime: number, phaseStartTime: number, phaseDuration: number) => {
    const phaseElapsed = currentTime - phaseStartTime;
    return Math.min((phaseElapsed / phaseDuration) * 100, 100);
  }, []);

  return {
    lessonState,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    updateProgress,
    updateActivityPhase,
    calculatePhaseProgress
  };
};
