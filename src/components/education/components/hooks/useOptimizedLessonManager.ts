
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
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
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

  // Handle manual navigation - only allow if target activity is completed or is the next sequential activity
  useEffect(() => {
    if (manualActivityIndex !== null && manualActivityIndex !== undefined) {
      console.log('🧭 Manual navigation attempted to:', manualActivityIndex);
      
      // Allow backward navigation to any completed activity
      if (manualActivityIndex < currentActivityIndex && completedActivities.has(manualActivityIndex)) {
        console.log('✅ Backward navigation allowed to completed activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      
      // Allow forward navigation only to the next activity if current is completed
      if (manualActivityIndex === currentActivityIndex + 1 && completedActivities.has(currentActivityIndex)) {
        console.log('✅ Forward navigation allowed to next activity:', manualActivityIndex);
        setCurrentActivityIndex(manualActivityIndex);
        return;
      }
      
      // Allow staying on current activity
      if (manualActivityIndex === currentActivityIndex) {
        console.log('✅ Staying on current activity:', manualActivityIndex);
        return;
      }
      
      console.log('❌ Navigation blocked - activity not accessible:', manualActivityIndex);
    }
  }, [manualActivityIndex, currentActivityIndex, completedActivities]);

  // Initialize activities and reset to activity 0
  useEffect(() => {
    const initializeActivities = async () => {
      console.log('🎯 Initializing optimized lesson activities for:', subject, skillArea);
      
      try {
        let activities = await generateMathActivities();
        console.log('✅ Generated activities:', activities.length);
        
        // If the first activity is the intro "Basic Math Concepts", remove it.
        if (activities.length > 0 && activities[0].title?.toLowerCase() === 'basic math concepts') {
          console.log('🚮 Removing introductory "Basic Math Concepts" activity.');
          activities = activities.slice(1);
        }

        // Map InteractiveActivity to LessonActivity interface
        const mappedActivities: LessonActivity[] = activities.map(activity => ({
          ...activity,
          duration: activity.duration || 120, // Use existing duration property or default
          phase: 'content-delivery' as const // Add required phase property
        }));

        setAllActivities(mappedActivities);
        setCurrentActivityIndex(0); // Always start at activity 0
        setCompletedActivities(new Set()); // Reset completion tracking
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
    
    // Mark current activity as completed
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      newSet.add(currentActivityIndex);
      console.log('✅ Marked activity as completed:', currentActivityIndex, 'Total completed:', newSet.size);
      return newSet;
    });
    
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

  // Check if current activity is completed
  const isCurrentActivityCompleted = completedActivities.has(currentActivityIndex);
  
  // Check if can navigate forward (next activity exists and current is completed)
  const canNavigateForward = currentActivityIndex < totalRealActivities - 1 && isCurrentActivityCompleted;
  
  // Check if can navigate backward (previous activity exists)
  const canNavigateBack = currentActivityIndex > 0;

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
    completedActivities,
    isCurrentActivityCompleted,
    canNavigateForward,
    canNavigateBack,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    autoReadEnabled,
    hasUserInteracted,
    teachingEngine
  };
};
