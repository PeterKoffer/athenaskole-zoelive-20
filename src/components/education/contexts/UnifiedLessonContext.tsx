
import { createContext, useContext } from 'react';
import { UnifiedLessonState } from './types/LessonContextTypes';

export const UnifiedLessonContext = createContext<UnifiedLessonState | null>(null);

export const useUnifiedLesson = () => {
  const context = useContext(UnifiedLessonContext);
  if (!context) {
    throw new Error('useUnifiedLesson must be used within UnifiedLessonProvider');
  }
  return context;
};

// Re-export types and provider for convenience
export type { LessonPhase, LessonState, UnifiedLessonState } from './types/LessonContextTypes';
export { UnifiedLessonProvider } from './UnifiedLessonProvider';
