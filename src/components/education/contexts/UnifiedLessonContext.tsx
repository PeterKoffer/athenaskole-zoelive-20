
import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { useEnhancedTeachingEngine } from '../components/hooks/useEnhancedTeachingEngine';
import { LessonActivity } from '../components/types/LessonTypes';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';

export interface LessonState {
  phase: LessonPhase;
  timeSpent: number;
  currentSegment: number;
  totalSegments: number;
  score: number;
}

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
  
  // Timer management (unified with session context)
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
  // Core lesson state
  const [lessonState, setLessonState] = useState({
    phase: 'introduction' as LessonPhase,
    timeSpent: 0,
    currentSegment: 0,
    totalSegments: allActivities.length,
    score: 0
  });

  // Activity progression state
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  
  // Timer state
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressionRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced teaching engine
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed: Math.floor((Date.now() - lessonStartTime) / 1000),
    correctStreak,
    score: lessonState.score,
    lessonStartTime
  });

  const currentActivity = allActivities[currentActivityIndex] || null;
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  // Timer effect
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setSessionTimer(prev => prev + 1);
        setLessonState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  // Auto-start lesson after introduction phase
  useEffect(() => {
    if (lessonState.phase === 'introduction') {
      console.log('🎓 Starting lesson automatically after introduction');
      setTimeout(() => {
        handleLessonStart();
      }, 2000);
    }
  }, []);

  const handleLessonStart = useCallback(() => {
    console.log('🚀 Lesson started');
    setLessonState(prev => ({ ...prev, phase: 'lesson' }));
    setIsTimerActive(true);
    
    // Auto-speak first activity
    setTimeout(() => {
      if (currentActivity && teachingEngine.autoReadEnabled) {
        const welcomeMessage = `Welcome to your ${subject} lesson! Let's begin our learning journey together!`;
        teachingEngine.speakWithPersonality(welcomeMessage, 'encouragement');
      }
    }, 1000);
  }, [currentActivity, teachingEngine, subject]);

  const handleLessonPause = useCallback(() => {
    setLessonState(prev => ({ ...prev, phase: 'paused' }));
    setIsTimerActive(false);
  }, []);

  const handleLessonResume = useCallback(() => {
    setLessonState(prev => ({ ...prev, phase: 'lesson' }));
    setIsTimerActive(true);
  }, []);

  const handleLessonComplete = useCallback(() => {
    setLessonState(prev => ({ ...prev, phase: 'completed' }));
    setIsTimerActive(false);
    
    // Clear any pending progression timers
    if (progressionRef.current) {
      clearTimeout(progressionRef.current);
    }
    
    onLessonComplete();
  }, [onLessonComplete]);

  const setScore = useCallback((value: React.SetStateAction<number>) => {
    setLessonState(prev => ({
      ...prev,
      score: typeof value === 'function' ? value(prev.score) : value
    }));
  }, []);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    const responseTime = Date.now() - lessonStartTime - (timeElapsed * 1000);
    setLastResponseTime(responseTime);

    console.log('✅ Activity completed:', currentActivityIndex, 'wasCorrect:', wasCorrect);

    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setScore(prev => prev + 10);
        setCorrectStreak(prev => prev + 1);
        
        // Immediate positive feedback
        setTimeout(() => {
          teachingEngine.speakWithPersonality("Excellent work! You're doing fantastic!", 'encouragement');
        }, 500);
      } else {
        setCorrectStreak(0);
        
        // Encouraging feedback for incorrect answers
        setTimeout(() => {
          teachingEngine.speakWithPersonality("That's okay! Learning takes practice. Let's keep going!", 'encouragement');
        }, 500);
      }
    }

    // Clear any existing progression timer
    if (progressionRef.current) {
      clearTimeout(progressionRef.current);
    }

    // Schedule progression to next activity
    progressionRef.current = setTimeout(() => {
      if (currentActivityIndex < allActivities.length - 1) {
        console.log('📚 Moving to next activity:', currentActivityIndex + 1);
        setCurrentActivityIndex(prev => prev + 1);
        setLessonState(prev => ({
          ...prev,
          currentSegment: currentActivityIndex + 1
        }));
      } else {
        console.log('🏁 Lesson completed!');
        const finalMinutes = Math.round(timeElapsed / 60);
        setTimeout(() => {
          const completionMessage = `Outstanding work! You've completed your ${finalMinutes}-minute ${subject} lesson! You've really grown as a learner today!`;
          teachingEngine.speakWithPersonality(completionMessage, 'encouragement');
        }, 1200);
        
        setTimeout(() => {
          handleLessonComplete();
        }, 5000);
      }
    }, wasCorrect !== undefined ? 2500 : 1500);
  }, [
    lessonStartTime,
    timeElapsed,
    allActivities,
    currentActivityIndex,
    subject,
    teachingEngine,
    handleLessonComplete,
    setScore
  ]);

  const handleReadRequest = useCallback(() => {
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
      
      console.log('🔊 Read request:', speechText.substring(0, 50));
      teachingEngine.speakWithPersonality(speechText, context);
    }
  }, [currentActivity, teachingEngine, subject]);

  const updateProgress = useCallback((segment: number, timeSpent: number, score: number) => {
    setLessonState(prev => ({
      ...prev,
      currentSegment: segment,
      timeSpent,
      score
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (progressionRef.current) {
        clearTimeout(progressionRef.current);
      }
    };
  }, []);

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
    setScore,
    setCorrectStreak,
    setLastResponseTime
  };

  return (
    <UnifiedLessonContext.Provider value={lessonStateValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};
