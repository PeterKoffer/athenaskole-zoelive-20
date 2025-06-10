import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { useEnhancedTeachingEngine } from '../components/hooks/useEnhancedTeachingEngine';
import { LessonActivity } from '../components/types/LessonTypes';

export type LessonPhase = 'introduction' | 'lesson' | 'paused' | 'completed';

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
    difficulty: 3,
    studentEngagement: 75,
    learningSpeed: 'adaptive'
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

  const handleLessonStart = useCallback(() => {
    setLessonState(prev => ({ ...prev, phase: 'lesson' }));
    setIsTimerActive(true);
  }, []);

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

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    const responseTime = Date.now() - lessonStartTime - (timeElapsed * 1000);
    setLastResponseTime(responseTime);

    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setScore(prev => prev + 10);
        setCorrectStreak(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Provide immediate feedback
    const currentActivity = allActivities[currentActivityIndex];
    if (currentActivity) {
      if (currentActivity.phase === 'interactive-game' && wasCorrect !== undefined) {
        const responseMessage = wasCorrect 
          ? `Excellent work! You're really mastering this ${subject} concept!`
          : `Good try! Let's keep working on this together. You're learning!`;
        teachingEngine.speakWithPersonality(responseMessage, wasCorrect ? 'encouragement' : 'supportive');
      }
    }

    // Clear any existing progression timer
    if (progressionRef.current) {
      clearTimeout(progressionRef.current);
    }

    // Schedule progression to next activity
    progressionRef.current = setTimeout(() => {
      if (currentActivityIndex < allActivities.length - 1) {
        console.log('📚 Moving to next activity');
        setCurrentActivityIndex(prev => prev + 1);
        setLessonState(prev => ({
          ...prev,
          currentSegment: currentActivityIndex + 1
        }));
      } else {
        console.log('🏁 Lesson completed!');
        const finalMinutes = Math.round(timeElapsed / 60);
        setTimeout(() => {
          const completionMessage = `Outstanding work! You've completed your ${finalMinutes}-minute ${subject} lesson! You've really grown as a learner today, and I'm so proud of your dedication!`;
          teachingEngine.speakWithPersonality(completionMessage, 'encouragement');
        }, 1200);
        
        setTimeout(() => {
          handleLessonComplete();
        }, 5000);
      }
    }, wasCorrect !== undefined ? 2500 : 1000);
  }, [
    lessonStartTime,
    timeElapsed,
    allActivities,
    currentActivityIndex,
    subject,
    teachingEngine,
    handleLessonComplete
  ]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      let speechText: string;
      let context: string;
      
      if (currentActivity.phase === 'explanation') {
        speechText = currentActivity.content.explanation || '';
        context = 'explanation';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
        context = 'question';
      } else {
        speechText = `Let me explain this step by step: ${currentActivity.title}`;
        context = 'explanation';
      }
      
      console.log('🔊 Read request:', speechText.substring(0, 50));
      teachingEngine.speakWithPersonality(speechText, context);
    }
  }, [currentActivity, teachingEngine]);

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