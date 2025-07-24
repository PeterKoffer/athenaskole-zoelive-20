
// @ts-nocheck
import { useEffect } from 'react';
import { LessonPhase } from '../../hooks/useLessonStateManager';

interface UseLessonInitializationProps {
  phase: LessonPhase;
  handleLessonStart: () => void;
}

export const useLessonInitialization = ({
  phase,
  handleLessonStart
}: UseLessonInitializationProps) => {
  // Only log the phase - no auto-start behavior
  useEffect(() => {
    console.log('🎯 Lesson initialization phase:', phase);
    // User must manually start the lesson
  }, [phase]);
};
