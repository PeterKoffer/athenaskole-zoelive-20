
import { LessonActivity } from '../../components/types/LessonTypes';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';

export interface LessonState {
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
}

export interface UnifiedLessonContextType {
  // Lesson state
  currentActivityIndex: number;
  allActivities: LessonActivity[];
  currentActivity: LessonActivity | null;
  phase: LessonPhase;
  
  // Progress tracking
  sessionTimer: number;
  score: number;
  correctStreak: number;
  isTimerActive: boolean;
  lessonStartTime: number;
  
  // Additional state properties for compatibility
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  
  // Actions
  handleActivityComplete: (wasCorrect?: boolean) => void;
  handleLessonStart: () => void;
  handleLessonPause: () => void;
  handleLessonResume: () => void;
  handleLessonComplete: () => void;
  handleReadRequest: () => void;
  
  // Loading states
  isLoadingActivities: boolean;
  regenerateLesson: () => Promise<void>;
}

export interface UnifiedLessonProviderProps {
  children: React.ReactNode;
  subject: string;
  allActivities?: LessonActivity[];
  onLessonComplete: () => void;
  skillArea?: string;
  gradeLevel?: number;
}
