
import { useState, useCallback } from 'react';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';

export interface LessonState {
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
}

interface UseLessonStateManagerProps {
  totalSegments: number;
  onLessonComplete?: () => void;
}

export const useLessonStateManager = ({ 
  totalSegments, 
  onLessonComplete 
}: UseLessonStateManagerProps) => {
  const [lessonState, setLessonState] = useState<LessonState>({
    phase: 'introduction',
    timeSpent: 0,
    currentSegment: 0,
    totalSegments,
    score: 0
  });

  const updatePhase = useCallback((phase: LessonPhase) => {
    setLessonState(prev => ({ ...prev, phase }));
  }, []);

  const updateScore = useCallback((scoreUpdate: number | ((prev: number) => number)) => {
    setLessonState(prev => ({
      ...prev,
      score: typeof scoreUpdate === 'function' ? scoreUpdate(prev.score) : scoreUpdate
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

  const completeLesson = useCallback(() => {
    updatePhase('completed');
    if (onLessonComplete) {
      onLessonComplete();
    }
  }, [updatePhase, onLessonComplete]);

  return {
    lessonState,
    updatePhase,
    updateScore,
    updateProgress,
    completeLesson
  };
};
