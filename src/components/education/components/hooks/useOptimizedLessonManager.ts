import { useState, useRef } from 'react';
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

  // --- Current Activity / Progress ---
  const currentActivity = allActivities[currentActivityIndex] || null;
  const totalRealActivities = allActivities.length;
  const targetLessonLength = 20; // 20 minutes

  // --- Activity completion logic ---
  const handleActivityComplete = useActivityCompletion({
    currentActivityIndex,
    allActivitiesLength: allActivities.length,
    timeElapsed,
    onLessonComplete,
    setCompletedActivities,
    setCurrentActivityIndex,
    setCorrectStreak,
    setScore
  });

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
      'canNavigateForward:', canNavigateForward
    );
  }, [currentActivityIndex, completedActivities, isCurrentActivityCompleted, canNavigateForward]);

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
