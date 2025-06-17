
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonState } from './useLessonState';
import { useDynamicActivityGeneration } from './useDynamicActivityGeneration';
import { useLessonProgression } from './useLessonProgression';
import { useLessonContentGeneration } from './useLessonContentGeneration';
import { useLessonProgressManager } from './useLessonProgressManager';

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
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

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

  const {
    generateIntroductionActivity,
    generateContentDeliveryActivity,
    generateInteractiveGameActivity,
    generateApplicationActivity,
    generateCreativeExplorationActivity,
    generateSummaryActivity
  } = useLessonContentGeneration(subject, skillArea);

  // Create base lesson activities using the generator functions
  const baseLessonActivities = [
    generateIntroductionActivity(),
    generateContentDeliveryActivity(),
    generateSummaryActivity()
  ];

  // Initialize progress manager
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
    lessonActivities: baseLessonActivities,
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

  const {
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity,
    forceFreshSession,
    sessionId
  } = useDynamicActivityGeneration({
    subject,
    skillArea,
    timeElapsed,
    usedQuestionIds,
    onQuestionUsed: () => {}
  });

  const [hasGeneratedInitialQuestions, setHasGeneratedInitialQuestions] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Ensure we always have interactive questions mixed with content
  const allActivities = [
    ...baseLessonActivities.slice(0, 2), // First 2 base activities
    ...dynamicActivities, // All dynamic questions (FRESH each session)
    ...baseLessonActivities.slice(2) // Remaining base activities
  ];

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

  // Generate FRESH questions for each new class session
  useEffect(() => {
    if (!hasGeneratedInitialQuestions && !isGeneratingQuestion && !isLoadingProgress) {
      console.log(`🆕 Starting FRESH question generation for ${subject} (Session: ${sessionId})`);
      setHasGeneratedInitialQuestions(true);
      
      const generateFreshQuestions = async () => {
        console.log(`🔄 Generating 8 BRAND NEW ${subject} questions...`);
        
        for (let i = 0; i < 8; i++) {
          try {
            console.log(`📝 Generating FRESH question ${i + 1}/8 for ${subject}...`);
            const newActivity = await generateSubjectQuestion();
            if (newActivity) {
              setDynamicActivities(prev => {
                const updated = [...prev, newActivity];
                console.log(`✅ Added FRESH ${subject} question ${i + 1}: ${newActivity.content.question.substring(0, 50)}...`);
                return updated;
              });
            } else {
              console.warn(`⚠️ Failed to generate ${subject} question ${i + 1}`);
            }
          } catch (error) {
            console.error(`❌ Error generating ${subject} question ${i + 1}:`, error);
          }
          
          if (i < 7) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Shorter delay for faster generation
          }
        }
        
        console.log(`✅ FRESH ${subject} question generation completed for session ${sessionId}`);
        setIsInitializing(false);
      };
      
      generateFreshQuestions();
    }
  }, [hasGeneratedInitialQuestions, isGeneratingQuestion, isLoadingProgress, generateSubjectQuestion, setDynamicActivities, subject, sessionId]);

  // Add force refresh functionality
  const refreshWithNewQuestions = useCallback(() => {
    console.log('🔄 User requested FRESH questions - forcing new session');
    forceFreshSession();
    setHasGeneratedInitialQuestions(false);
    setIsInitializing(true);
  }, [forceFreshSession]);

  console.log(`🧠 FRESH ${subject} lesson (Session: ${sessionId}): ${allActivities.length} activities, targeting ${targetLessonLength} minutes`);

  return {
    currentActivityIndex,
    lessonActivities: allActivities,
    currentActivity,
    timeElapsed,
    totalEstimatedTime: allActivities.reduce((total, activity) => total + activity.duration, 0),
    score,
    correctStreak,
    questionsGenerated,
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
