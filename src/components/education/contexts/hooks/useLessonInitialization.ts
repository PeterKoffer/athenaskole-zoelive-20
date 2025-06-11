
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
  // Remove auto-start - let user control when to begin
  useEffect(() => {
    console.log('🎯 Lesson initialization phase:', phase);
    // No auto-start - user must click to begin
  }, [phase, handleLessonStart]);
};
