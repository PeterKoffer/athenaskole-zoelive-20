
import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonState } from './useLessonState';
import { useDynamicActivityGeneration } from './useDynamicActivityGeneration';
import { useLessonProgression } from './useLessonProgression';

import { useLessonProgressManager } from './useLessonProgressManager';
import { useVariedLessonGenerator } from './useVariedLessonGenerator';

interface UseExtendedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useExtendedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete
}: UseExtendedLessonManagerProps) => {
  const { user } = useAuth();
  

  // Use the smaller, focused hooks
  const {
    currentActivityIndex,
    setCurrentActivityIndex,
    lessonStartTime,
    score,
    setScore,
    correctStreak,
    setCorrectStreak,
    setLastResponseTime,
    targetLessonLength,
    timeElapsed
  } = useLessonState();


  // Use the new varied lesson generator
  const { generateVariedLessonActivities } = useVariedLessonGenerator({
    subject,
    skillArea,
    sessionId: `varied-${Date.now()}`
  });

  // Generate VARIED lesson activities instead of repetitive ones
  const variedLessonActivities = generateVariedLessonActivities();

  // Initialize progress manager
  const {
    isLoadingProgress,
    saveProgress,
    completeLessonProgress,
    resetProgress
  } = useLessonProgressManager(subject);

  const {
    sessionId
  } = useDynamicActivityGeneration({
    subject,
    skillArea,
    timeElapsed,
    usedQuestionIds: [],
    onQuestionUsed: () => {}
  });

  const [isInitializing, setIsInitializing] = useState(false);

  // Use the varied activities as the main lesson content
  const allActivities = variedLessonActivities;

  const {
    teachingEngine,
    currentActivity,
    handleActivityComplete: originalHandleActivityComplete,
    handleReadRequest
  } = useLessonProgression({
    subject,
    currentActivityIndex,
    allActivities,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime,
    setCurrentActivityIndex,
    setScore,
    setCorrectStreak,
    setLastResponseTime,
    onLessonComplete: async () => {
      if (user?.id) {
        await completeLessonProgress();
      }
      onLessonComplete();
    }
  });

  // Enhanced activity completion handler with progress saving
  const handleActivityComplete = useCallback(async (wasCorrect?: boolean) => {
    console.log('✅ Activity completed, saving progress...');
    
    // Call original handler first
    originalHandleActivityComplete(wasCorrect);
    
    // Save progress after state updates
    setTimeout(async () => {
      await saveProgress();
    }, 100);
  }, [originalHandleActivityComplete, saveProgress]);

  // Add force refresh functionality
  const refreshWithNewQuestions = useCallback(() => {
    console.log('🔄 User requested FRESH activities - generating new varied lesson');
    // The varied lesson generator will create new activities each time
    setIsInitializing(true);
    setTimeout(() => setIsInitializing(false), 1000);
  }, []);

  console.log(`🎨 VARIED ${subject} lesson: ${allActivities.length} activities with games, simulations, and creative activities`);

  return {
    currentActivityIndex,
    lessonActivities: allActivities,
    currentActivity,
    timeElapsed,
    totalEstimatedTime: allActivities.reduce((total, activity) => total + activity.duration, 0),
    score,
    correctStreak,
    questionsGenerated: allActivities.length,
    targetLessonLength,
    isInitializing: isInitializing || isLoadingProgress,
    engagementLevel: teachingEngine.engagementLevel,
    adaptiveSpeed: teachingEngine.adaptiveSpeed,
    isSpeaking: teachingEngine.isSpeaking,
    autoReadEnabled: teachingEngine.autoReadEnabled,
    hasUserInteracted: teachingEngine.hasUserInteracted,
    isReady: teachingEngine.isReady,
    speakText: teachingEngine.speakWithPersonality,
    stopSpeaking: teachingEngine.stopSpeaking,
    toggleMute: teachingEngine.toggleMute,
    handleActivityComplete,
    handleReadRequest,
    resetProgress,
    refreshWithNewQuestions,
    sessionId
  };
};
