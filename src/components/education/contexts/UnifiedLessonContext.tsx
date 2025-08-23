
import { createContext, useContext } from 'react';
import { UnifiedLessonContextType } from './types/UnifiedLessonTypes';

export const UnifiedLessonContext = createContext<UnifiedLessonContextType | undefined>(undefined);

// Safe fallback to prevent crashes if a component renders outside the provider
const UNIFIED_LESSON_FALLBACK: UnifiedLessonContextType = {
  currentActivityIndex: 0,
  allActivities: [],
  currentActivity: null,
  phase: 'introduction',
  sessionTimer: 0,
  score: 0,
  correctStreak: 0,
  isTimerActive: false,
  lessonStartTime: Date.now(),
  timeSpent: 0,
  currentSegment: 0,
  totalSegments: 0,
  handleActivityComplete: () => {},
  handleLessonStart: () => {},
  handleLessonPause: () => {},
  handleLessonResume: () => {},
  handleLessonComplete: () => {},
  handleReadRequest: () => {},
  isLoadingActivities: true,
  regenerateLesson: async () => {},
  targetDuration: 0,
  isExtending: false,
  usedQuestionCount: 0,
};

export const useUnifiedLesson = () => {
  const context = useContext(UnifiedLessonContext);
  if (context === undefined) {
    if (import.meta?.env?.MODE !== 'production') {
      console.warn('useUnifiedLesson called outside provider; returning fallback to avoid crash.');
    }
    return UNIFIED_LESSON_FALLBACK;
  }
  return context;
};

// Re-export everything from the refactored files
export { UnifiedLessonProvider } from './UnifiedLessonProvider';
export type { LessonPhase, LessonState, UnifiedLessonContextType } from './types/UnifiedLessonTypes';
