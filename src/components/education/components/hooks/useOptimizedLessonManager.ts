
import { useState, useRef, useEffect } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useTimerManager } from '../../hooks/useTimerManager';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { LessonActivity } from '../types/LessonTypes';

import { useLessonActivitiesInitializer } from './useLessonActivitiesInitializer';
import { useActivityNavigation } from './useActivityNavigation';
import { useActivityCompletion } from './useActivityCompletion';
import { useLessonScore } from './useLessonScore';
import { useSpeechHandler } from './useSpeechHandler';

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
  // --- Initialization/Activity Generation ---
  const { timeElapsed, startTimer } = useTimerManager({ autoStart: false });
  const { allActivities, isInitializing, lessonStartTime } = useLessonActivitiesInitializer(subject, skillArea, startTimer);

  // --- State ---
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());

  const { score, setScore, correctStreak, setCorrectStreak } = useLessonScore();

  // --- Unified speech ---
  const {
    isEnabled: autoReadEnabled,
    isSpeaking,
    hasUserInteracted,
    toggleEnabled: toggleMute
  } = useUnifiedSpeech();

  // --- Teaching engine ---
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime: lessonStartTime.current
  });

  // --- Manual navigation logic ---
  useActivityNavigation({
    manualActivityIndex,
    currentActivityIndex,
    completedActivities,
    setCurrentActivityIndex
  });

  // ONLY use interactive-game activities - NO welcome screens, NO introduction activities
  const filteredActivities = allActivities.filter(activity => 
    activity.type === 'interactive-game' && 
    activity.phase === 'interactive-game' &&
    !activity.title.toLowerCase().includes('welcome') &&
    !activity.title.toLowerCase().includes('introduction') &&
    !activity.title.toLowerCase().includes('ready to start')
  );

  // --- Current Activity / Progress ---
  const currentActivity = filteredActivities[currentActivityIndex] || null;
  const totalRealActivities = filteredActivities.length;
  const targetLessonLength = 20; // 20 minutes

  // --- Activity completion logic ---
  const handleActivityComplete = (wasCorrect?: boolean) => {
    console.log('🎯 Activity completion triggered:', {
      currentActivityIndex,
      wasCorrect,
      totalActivities: filteredActivities.length,
      activityId: currentActivity?.id
    });

    // Mark current activity as completed
    setCompletedActivities(prev => new Set([...prev, currentActivityIndex]));

    // Update score and streak based on correctness
    if (wasCorrect === true) {
      setScore(prev => prev + 15);
      setCorrectStreak(prev => prev + 1);
      console.log('✅ Correct answer - score and streak updated');
    } else if (wasCorrect === false) {
      setCorrectStreak(0);
      console.log('❌ Incorrect answer - streak reset');
    }

    // Small delay before advancing to next activity
    setTimeout(() => {
      if (currentActivityIndex < filteredActivities.length - 1) {
        console.log('➡️ Advancing to next unique activity:', currentActivityIndex + 1);
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🏁 All unique activities completed - ending lesson');
        setTimeout(() => {
          onLessonComplete();
        }, 2000);
      }
    }, 1500);
  };

  // --- Speech/Read request logic ---
  const handleReadRequest = useSpeechHandler({
    currentActivity,
    teachingEngine
  });

  // --- Completion status/navigation state ---
  const isCurrentActivityCompleted = completedActivities.has(currentActivityIndex);
  const canNavigateForward = currentActivityIndex < totalRealActivities - 1 && isCurrentActivityCompleted;
  const canNavigateBack = currentActivityIndex > 0;

  // --- Debug ---
  useEffect(() => {
    console.log('[OptimizedLessonManager] Index:', currentActivityIndex,
      'Completed:', Array.from(completedActivities),
      'isCurrentActivityCompleted:', isCurrentActivityCompleted,
      'canNavigateForward:', canNavigateForward,
      'Total activities:', totalRealActivities,
      'Current activity ID:', currentActivity?.id,
      'Is initializing:', isInitializing,
      'All activities count:', allActivities.length,
      'Filtered activities count:', filteredActivities.length
    );
  }, [currentActivityIndex, completedActivities, isCurrentActivityCompleted, canNavigateForward, totalRealActivities, currentActivity, isInitializing, allActivities.length, filteredActivities.length]);

  return {
    currentActivityIndex,
    setCurrentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing: isInitializing || filteredActivities.length === 0,
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
