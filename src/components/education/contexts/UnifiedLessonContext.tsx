import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useEnhancedTeachingEngine } from '../components/hooks/useEnhancedTeachingEngine';
import { LessonActivity } from '../components/types/LessonTypes';
import { useTimerManager } from '../hooks/useTimerManager';
import { useLessonStateManager, LessonPhase, LessonState } from '../hooks/useLessonStateManager';
import { useActivityProgression } from '../hooks/useActivityProgression';

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

interface UnifiedLessonContextProps {
  subject: string;
  allActivities: LessonActivity[];
  onLessonComplete: () => void;
  children: ReactNode;
}

const UnifiedLessonContext = createContext<UnifiedLessonState | null>(null);

export const useUnifiedLesson = () => {
  const context = useContext(UnifiedLessonContext);
  if (!context) {
    throw new Error('useUnifiedLesson must be used within UnifiedLessonProvider');
  }
  return context;
};

export const UnifiedLessonProvider = ({
  subject,
  allActivities,
  onLessonComplete,
  children
}: UnifiedLessonContextProps) => {
  const lessonStartTime = Date.now();
  
  // Timer management
  const { 
    timeElapsed: sessionTimer, 
    isActive: isTimerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  } = useTimerManager();

  // Lesson state management
  const {
    lessonState,
    updatePhase,
    updateScore,
    updateProgress,
    completeLesson
  } = useLessonStateManager({
    totalSegments: allActivities.length,
    onLessonComplete
  });

  // Activity progression
  const {
    currentActivityIndex,
    currentActivity,
    correctStreak,
    lastResponseTime,
    handleActivityComplete: handleActivityCompleteBase,
    setCurrentActivityIndex,
    setCorrectStreak,
    setLastResponseTime
  } = useActivityProgression({
    allActivities,
    onLessonComplete: completeLesson
  });

  // Enhanced teaching engine
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed: sessionTimer,
    correctStreak,
    score: lessonState.score,
    lessonStartTime
  });

  // Auto-start lesson after introduction phase
  useEffect(() => {
    if (lessonState.phase === 'introduction') {
      setTimeout(() => {
        handleLessonStart();
      }, 2000);
    }
  }, []);

  const handleLessonStart = () => {
    updatePhase('lesson');
    startTimer();
    
    // Auto-speak first activity
    setTimeout(() => {
      if (currentActivity && teachingEngine.autoReadEnabled) {
        const welcomeMessage = `Welcome to your ${subject} lesson! Let's begin our learning journey together!`;
        teachingEngine.speakWithPersonality(welcomeMessage, 'encouragement');
      }
    }, 1000);
  };

  const handleLessonPause = () => {
    updatePhase('paused');
    pauseTimer();
  };

  const handleLessonResume = () => {
    updatePhase('lesson');
    resumeTimer();
  };

  const handleLessonComplete = () => {
    updatePhase('completed');
    stopTimer();
    completeLesson();
  };

  const handleActivityComplete = (wasCorrect?: boolean) => {
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        updateScore(prev => prev + 10);
        setTimeout(() => {
          teachingEngine.speakWithPersonality("Excellent work! You're doing fantastic!", 'encouragement');
        }, 500);
      } else {
        setTimeout(() => {
          teachingEngine.speakWithPersonality("That's okay! Learning takes practice. Let's keep going!", 'encouragement');
        }, 500);
      }
    }

    handleActivityCompleteBase(wasCorrect);
  };

  const handleReadRequest = () => {
    if (currentActivity) {
      let speechText: string;
      let context: 'question' | 'explanation' | 'encouragement' | 'humor' = 'explanation';
      
      if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.text || currentActivity.content.segments?.[0]?.explanation || '';
        context = 'explanation';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
        context = 'question';
      } else if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || `Welcome to your ${subject} lesson!`;
        context = 'humor';
      } else {
        speechText = `Let me explain this step by step: ${currentActivity.title}`;
        context = 'explanation';
      }
      
      teachingEngine.speakWithPersonality(speechText, context);
    }
  };

  const lessonStateValue: UnifiedLessonState = {
    ...lessonState,
    currentActivityIndex,
    allActivities,
    currentActivity,
    correctStreak,
    lessonStartTime,
    lastResponseTime,
    sessionTimer,
    isTimerActive,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest,
    updateProgress,
    setCurrentActivityIndex,
    setScore: updateScore,
    setCorrectStreak,
    setLastResponseTime
  };

  return (
    <UnifiedLessonContext.Provider value={lessonStateValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};
