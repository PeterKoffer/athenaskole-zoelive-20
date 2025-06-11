
import { LessonActivity } from '../../components/types/LessonTypes';
import { LessonPhase, LessonState } from '../../hooks/useLessonStateManager';

// Re-export types for use in other components
export type { LessonPhase, LessonState };

export interface UnifiedLessonState {
  // Core lesson state
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
  
  // Activity progression
  currentActivityIndex: number;
  allActivities: LessonActivity[];
  currentActivity: LessonActivity | null;
  correctStreak: number;
  lessonStartTime: number;
  lastResponseTime: number;
  
  // Timer management
  sessionTimer: number;
  isTimerActive: boolean;
  
  // Actions
  handleLessonStart: () => void;
  handleLessonPause: () => void;
  handleLessonResume: () => void;
  handleLessonComplete: () => void;
  handleActivityComplete: (wasCorrect?: boolean) => void;
  handleReadRequest: () => void;
  updateProgress: (segment: number, timeSpent: number, score: number) => void;
  setCurrentActivityIndex: (value: React.SetStateAction<number>) => void;
  setScore: (value: React.SetStateAction<number>) => void;
  setCorrectStreak: (value: React.SetStateAction<number>) => void;
  setLastResponseTime: (value: React.SetStateAction<number>) => void;
}

export interface UnifiedLessonContextProps {
  subject: string;
  allActivities: LessonActivity[];
  onLessonComplete: () => void;
  children: React.ReactNode;
}
