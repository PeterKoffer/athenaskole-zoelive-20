
import { useState, useCallback } from 'react';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';

export interface LessonState {
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
}

export const useLessonStateManager = () => {
  const [lessonState, setLessonState] = useState<LessonState>({
    phase: 'introduction',
    timeSpent: 0,
    currentSegment: 0,
    totalSegments: 6, // Standard lesson structure
    score: 0
  });

  const handleLessonStart = useCallback(() => {
    setLessonState(prev => ({
      ...prev,
      phase: 'lesson'
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
      phase: 'completed'
    }));
  }, []);

  const updateProgress = useCallback((segment: number, timeSpent: number, score: number) => {
    setLessonState(prev => ({
      ...prev,
      currentSegment: segment,
      timeSpent,
      score
    }));
  }, []);

  return {
    lessonState,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    updateProgress
  };
};
