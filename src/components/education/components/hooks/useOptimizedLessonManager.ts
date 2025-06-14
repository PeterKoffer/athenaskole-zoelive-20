
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonState } from './useLessonState';
import { useLessonContentGeneration } from './useLessonContentGeneration';
import { useLessonProgressManager } from './useLessonProgressManager';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';

interface UseOptimizedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useOptimizedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete
}: UseOptimizedLessonManagerProps) => {
  const { user } = useAuth();
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const [realActivityCount, setRealActivityCount] = useState(0);

  // Use the smaller, focused hooks
  const {
    currentActivityIndex,
    setCurrentActivityIndex,
    lessonStartTime,
    score,
    setScore,
    correctStreak,
    setCorrectStreak,
    lastResponseTime,
    setLastResponseTime,
    targetLessonLength,
    timeElapsed
  } = useLessonState();

  const { baseLessonActivities } = useLessonContentGeneration({ subject });

  // Enhanced teaching engine
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime
  });

  // Filter out non-activities (loading states, transitions) for counting
  const realActivities = baseLessonActivities.filter(activity => 
    activity.type !== 'loading' && 
    activity.type !== 'transition' && 
    !activity.title.toLowerCase().includes('loading') &&
    !activity.title.toLowerCase().includes('continue')
  );

  // Update real activity count when activities change
  useEffect(() => {
    setRealActivityCount(realActivities.length);
  }, [realActivities.length]);

  // Initialize progress manager with real activities only
  const {
    isLoadingProgress,
    usedQuestionIds,
    saveProgress,
    completeLessonProgress,
    generateSubjectQuestion,
    resetProgress
  } = useLessonProgressManager({
    subject,
    skillArea,
    lessonActivities: realActivities, // Only track real activities
    currentActivityIndex,
    score,
    timeElapsed,
    onProgressLoaded: (progress) => {
      if (!hasRestoredProgress && progress) {
        console.log('🔄 Restoring lesson progress:', progress);
        setCurrentActivityIndex(progress.current_activity_index);
        setScore(progress.score);
        setHasRestoredProgress(true);
      }
    }
  });

  const currentActivity = realActivities[currentActivityIndex] || null;

  // Enhanced activity completion handler with progress saving
  const handleActivityComplete = useCallback(async (wasCorrect?: boolean) => {
    console.log('✅ Real activity completed, saving progress...');
    
    // Update response time
    setLastResponseTime(new Date());
    
    // Handle scoring and streaks
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Check if lesson should complete
    const nextRealActivityIndex = currentActivityIndex + 1;
    if (nextRealActivityIndex >= realActivities.length || timeElapsed >= targetLessonLength) {
      console.log('🎓 Lesson completed!');
      if (user?.id) {
        await completeLessonProgress();
      }
      onLessonComplete();
      return;
    }

    // Move to next real activity
    console.log('➡️ Moving to next real activity:', nextRealActivityIndex);
    setCurrentActivityIndex(nextRealActivityIndex);
    
    // Save progress after state updates
    setTimeout(async () => {
      await saveProgress();
    }, 100);
  }, [
    currentActivityIndex, 
    realActivities.length, 
    timeElapsed, 
    targetLessonLength,
    user?.id,
    completeLessonProgress,
    onLessonComplete,
    setLastResponseTime,
    setCorrectStreak,
    setScore,
    setCurrentActivityIndex,
    saveProgress
  ]);

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

  console.log(`🧠 Optimized ${subject} lesson: ${realActivityCount} real activities, targeting ${targetLessonLength} minutes`);

  return {
    // Activity management - only counting real activities
    currentActivityIndex,
    lessonActivities: realActivities,
    currentActivity,
    totalRealActivities: realActivityCount,
    
    // Progress tracking
    timeElapsed,
    totalEstimatedTime: realActivities.reduce((total, activity) => total + activity.duration, 0),
    score,
    correctStreak,
    targetLessonLength,
    
    // State management
    isInitializing: isLoadingProgress,
    
    // Teaching engine integration
    engagementLevel: teachingEngine.engagementLevel,
    adaptiveSpeed: teachingEngine.adaptiveSpeed,
    isSpeaking: teachingEngine.isSpeaking,
    autoReadEnabled: teachingEngine.autoReadEnabled,
    hasUserInteracted: teachingEngine.hasUserInteracted,
    isReady: teachingEngine.isReady,
    speakText: teachingEngine.speakWithPersonality,
    stopSpeaking: teachingEngine.stopSpeaking,
    toggleMute: teachingEngine.toggleMute,
    
    // Event handlers
    handleActivityComplete,
    handleReadRequest,
    resetProgress,

    // Question generation for interactive activities
    generateSubjectQuestion,
    usedQuestionIds
  };
};
