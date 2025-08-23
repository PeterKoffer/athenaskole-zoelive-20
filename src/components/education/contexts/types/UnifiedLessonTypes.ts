
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
  // Core lesson state
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
  
  // Compatibility properties for existing components
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
  
  // Loading and generation states
  isLoadingActivities: boolean;
  regenerateLesson: () => Promise<void>;
  
  // Dev-only QA/iteration helpers
  replaceActivityBySlotId?: (slotId: string, fresh: LessonActivity) => void;
  regenerateActivityBySlotId?: (slotId: string, intent?: 'harder' | 'easier' | 'changeKind') => Promise<void>;
  isSlotBusy?: (slotId: string) => boolean;
  
  // Dynamic extension properties
  targetDuration?: number;
  isExtending?: boolean;
  usedQuestionCount?: number;
}

export interface UnifiedLessonProviderProps {
  children: React.ReactNode;
  subject: string;
  skillArea?: string;
  gradeLevel?: number;
  allActivities?: LessonActivity[];
  onLessonComplete: () => void;
}
