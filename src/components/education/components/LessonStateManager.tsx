
import { useState } from 'react';

export interface LessonState {
  phase: 'introduction' | 'lesson' | 'paused' | 'completed';
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  canResume: boolean;
}

export const useLessonStateManager = (totalSegments: number = 12) => {
  const [lessonState, setLessonState] = useState<LessonState>({
    phase: 'introduction',
    timeSpent: 0,
    currentSegment: 1,
    totalSegments,
    canResume: false
  });

  const handleLessonStart = () => {
    setLessonState(prev => ({ ...prev, phase: 'lesson' }));
  };

  const handleLessonPause = () => {
    setLessonState(prev => ({ 
      ...prev, 
      phase: 'paused',
      canResume: true 
    }));
  };

  const handleLessonResume = () => {
    setLessonState(prev => ({ ...prev, phase: 'lesson' }));
  };

  const handleLessonComplete = () => {
    setLessonState(prev => ({ ...prev, phase: 'completed' }));
  };

  return {
    lessonState,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete
  };
};
