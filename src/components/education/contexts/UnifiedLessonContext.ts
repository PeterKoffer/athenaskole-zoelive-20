
import { createContext, useContext } from 'react';
import { UnifiedLessonContextType } from './types/UnifiedLessonTypes';

export const UnifiedLessonContext = createContext<UnifiedLessonContextType | undefined>(undefined);

export const useUnifiedLesson = () => {
  const context = useContext(UnifiedLessonContext);
  if (context === undefined) {
    throw new Error('useUnifiedLesson must be used within a UnifiedLessonProvider');
  }
  return context;
};

// Re-export types for backward compatibility
export type { LessonPhase, LessonState } from './types/UnifiedLessonTypes';
