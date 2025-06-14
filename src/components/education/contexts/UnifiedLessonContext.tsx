import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonStateManager, LessonPhase, LessonState } from '../hooks/useLessonStateManager';
import { useLessonTimer } from '../hooks/useLessonTimer';
import { useLessonActions } from './hooks/useLessonActions';
import { LessonActivity } from '../components/types/LessonTypes';
import { dailyLessonGenerator } from '@/services/dailyLessonGenerator';

// Export the types for other components
export type { LessonPhase, LessonState };

interface UnifiedLessonContextType {
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

const UnifiedLessonContext = createContext<UnifiedLessonContextType | undefined>(undefined);

// Export the context
export { UnifiedLessonContext };

interface UnifiedLessonProviderProps {
  children: React.ReactNode;
  subject: string;
  allActivities?: LessonActivity[]; // Now optional, will be generated daily
  onLessonComplete: () => void;
  skillArea?: string;
  gradeLevel?: number;
}

export const UnifiedLessonProvider = ({ 
  children, 
  subject, 
  allActivities: staticActivities = [], 
  onLessonComplete,
  skillArea = 'general',
  gradeLevel = 6
}: UnifiedLessonProviderProps) => {
  const { user } = useAuth();
  const [allActivities, setAllActivities] = useState<LessonActivity[]>(staticActivities);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [lastGeneratedDate, setLastGeneratedDate] = useState<string>('');
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Get today's date for lesson generation
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  // Generate daily lesson based on curriculum and student progress
  const generateDailyLesson = useCallback(async (forceRegenerate = false) => {
    if (!user?.id) {
      console.log('⚠️ No user available, using static activities');
      setAllActivities(staticActivities);
      setIsLoadingActivities(false);
      return;
    }

    const currentDate = getCurrentDate();
    
    // Check if we need to generate a new lesson
    if (!forceRegenerate && lastGeneratedDate === currentDate && allActivities.length > 0) {
      console.log('📚 Using existing lesson for today');
      setIsLoadingActivities(false);
      return;
    }

    console.log(`🎯 Generating NEW daily lesson for ${subject} - ${currentDate}`);
    setIsLoadingActivities(true);

    try {
      // Clear cache if force regenerating
      if (forceRegenerate) {
        dailyLessonGenerator.clearTodaysLesson(user.id, subject, currentDate);
      }

      const newActivities = await dailyLessonGenerator.generateDailyLesson({
        subject,
        skillArea,
        userId: user.id,
        gradeLevel: gradeLevel || 6,
        currentDate
      });

      console.log(`✅ Generated ${newActivities.length} new activities for ${subject}`);
      setAllActivities(newActivities);
      setLastGeneratedDate(currentDate);
      
    } catch (error) {
      console.error('❌ Failed to generate daily lesson, using fallback:', error);
      // Fallback to static activities if generation fails
      setAllActivities(staticActivities.length > 0 ? staticActivities : []);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [user?.id, subject, skillArea, gradeLevel, staticActivities, lastGeneratedDate, allActivities.length]);

  // Generate lesson on mount and when date changes
  useEffect(() => {
    generateDailyLesson();
  }, [generateDailyLesson]);

  // Check for date change every minute to regenerate lessons
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = getCurrentDate();
      if (lastGeneratedDate && lastGeneratedDate !== currentDate) {
        console.log('📅 Date changed, generating new lesson');
        generateDailyLesson();
      }
    };

    const interval = setInterval(checkDateChange, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastGeneratedDate, generateDailyLesson]);

  // Initialize lesson state management
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

  // Initialize timer
  const {
    sessionTimer,
    lessonStartTime,
    isTimerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  } = useLessonTimer();

  // Get current activity
  const currentActivity = allActivities[currentActivityIndex] || null;

  // Handle activity completion
  const handleActivityCompleteBase = useCallback((wasCorrect?: boolean) => {
    if (currentActivityIndex < allActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      // Lesson completed
      setTimeout(() => {
        updatePhase('completed');
        stopTimer();
        onLessonComplete();
      }, 2000);
    }
  }, [currentActivityIndex, allActivities.length, updatePhase, stopTimer, onLessonComplete]);

  // Initialize lesson actions
  const {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest
  } = useLessonActions({
    subject,
    sessionTimer,
    correctStreak: correctStreak,
    score: lessonState.score,
    lessonStartTime,
    currentActivity,
    updatePhase,
    updateScore,
    completeLesson,
    handleActivityCompleteBase,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  });

  // Regenerate lesson function (for manual refresh)
  const regenerateLesson = useCallback(async () => {
    console.log('🔄 Manual lesson regeneration requested');
    await generateDailyLesson(true);
  }, [generateDailyLesson]);

  const contextValue: UnifiedLessonContextType = {
    // Lesson state
    currentActivityIndex,
    allActivities,
    currentActivity,
    phase: lessonState.phase,
    
    // Progress tracking
    sessionTimer,
    score: lessonState.score,
    correctStreak,
    isTimerActive,
    lessonStartTime,
    
    // Compatibility properties
    timeSpent: sessionTimer,
    currentSegment: currentActivityIndex,
    totalSegments: allActivities.length,
    
    // Actions
    handleActivityComplete,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleReadRequest,
    
    // Loading states
    isLoadingActivities,
    regenerateLesson
  };

  return (
    <UnifiedLessonContext.Provider value={contextValue}>
      {children}
    </UnifiedLessonContext.Provider>
  );
};

export const useUnifiedLesson = () => {
  const context = useContext(UnifiedLessonContext);
  if (context === undefined) {
    throw new Error('useUnifiedLesson must be used within a UnifiedLessonProvider');
  }
  return context;
};
