
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
  // Auto-start lesson after introduction phase
  useEffect(() => {
    if (phase === 'introduction') {
      setTimeout(() => {
        handleLessonStart();
      }, 2000);
    }
  }, [phase, handleLessonStart]);
};
