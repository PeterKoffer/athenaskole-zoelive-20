
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useTimerManager } from '../../hooks/useTimerManager';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { generateMathActivities } from '../math/utils/mathActivityGenerator';
import { LessonActivity } from '../types/LessonTypes';

interface UseOptimizedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  manualActivityIndex?: number | null;
}

export const useOptimizedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  manualActivityIndex
}: UseOptimizedLessonManagerProps) => {
  const [allActivities, setAllActivities] = useState<LessonActivity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const lessonStartTime = useRef(Date.now());

  const { timeElapsed, startTimer } = useTimerManager({ autoStart: false });

  const {
    isEnabled: autoReadEnabled,
    isSpeaking,
    hasUserInteracted,
    toggleEnabled: toggleMute,
    speakAsNelie
  } = useUnifiedSpeech();

  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime: lessonStartTime.current
  });

  // Handle manual navigation
  useEffect(() => {
    if (manualActivityIndex !== null && manualActivityIndex !== undefined) {
      console.log('🧭 Manual navigation triggered:', manualActivityIndex);
      setCurrentActivityIndex(manualActivityIndex);
    }
  }, [manualActivityIndex]);

  // Initialize activities
  useEffect(() => {
    const initializeActivities = async () => {
      console.log('🎯 Initializing optimized lesson activities for:', subject, skillArea);
      
      try {
        const activities = await generateMathActivities();
        console.log('✅ Generated activities:', activities.length);
        setAllActivities(activities);
        setIsInitializing(false);
        startTimer();
      } catch (error) {
        console.error('❌ Failed to generate activities:', error);
        setIsInitializing(false);
      }
    };

    initializeActivities();
  }, [subject, skillArea, startTimer]);

  const currentActivity = allActivities[currentActivityIndex] || null;
  const totalRealActivities = allActivities.length;
  const targetLessonLength = 20; // 20 minutes

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('📚 Activity completed:', currentActivityIndex, wasCorrect);
    
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Check if lesson is complete
    const nextIndex = currentActivityIndex + 1;
    if (nextIndex >= allActivities.length || timeElapsed >= 1200) { // 20 minutes = 1200 seconds
      console.log('🎓 Lesson completed!');
      onLessonComplete();
    } else {
      console.log('➡️ Moving to next activity:', nextIndex);
      setCurrentActivityIndex(nextIndex);
    }
  }, [currentActivityIndex, allActivities.length, timeElapsed, onLessonComplete]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity && teachingEngine.isReady) {
      const textToRead = currentActivity.content?.text || 
                        currentActivity.content?.question || 
                        currentActivity.title;
      if (textToRead) {
        teachingEngine.speakWithPersonality(textToRead);
      }
    }
  }, [currentActivity, teachingEngine]);

  return {
    currentActivityIndex,
    setCurrentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    autoReadEnabled,
    hasUserInteracted,
    teachingEngine
  };
};
