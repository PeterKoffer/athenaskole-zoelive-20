
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

  const { baseLessonActivities } = useLessonContentGeneration({ subject });

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
    generateDynamicActivity
  } = useDynamicActivityGeneration({
    subject,
    skillArea,
    timeElapsed,
    usedQuestionIds,
    onQuestionUsed: () => {} // Handled by progress manager
  });

  const [hasGeneratedInitialQuestions, setHasGeneratedInitialQuestions] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Ensure we always have interactive questions mixed with content
  const allActivities = [
    ...baseLessonActivities.slice(0, 2), // First 2 base activities
    ...dynamicActivities, // All dynamic questions
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

  // Generate initial questions with subject specificity
  useEffect(() => {
    if (!hasGeneratedInitialQuestions && !isGeneratingQuestion && !isLoadingProgress) {
      console.log('🎯 Starting initial subject-specific question generation...');
      setHasGeneratedInitialQuestions(true);
      
      const generateInitialQuestions = async () => {
        console.log('🔄 Generating 8 subject-specific questions...');
        
        for (let i = 0; i < 8; i++) {
          try {
            console.log(`📝 Generating question ${i + 1}/8 for ${subject}...`);
            const newActivity = await generateSubjectQuestion();
            if (newActivity) {
              setDynamicActivities(prev => {
                const updated = [...prev, newActivity];
                console.log(`✅ Added ${subject} question ${i + 1}: ${newActivity.content.question.substring(0, 50)}...`);
                return updated;
              });
            } else {
              console.warn(`⚠️ Failed to generate ${subject} question ${i + 1}`);
            }
          } catch (error) {
            console.error(`❌ Error generating ${subject} question ${i + 1}:`, error);
          }
          
          if (i < 7) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        console.log(`✅ Initial ${subject} question generation completed`);
        setIsInitializing(false);
      };
      
      generateInitialQuestions();
    }
  }, [hasGeneratedInitialQuestions, isGeneratingQuestion, isLoadingProgress, generateSubjectQuestion, setDynamicActivities, subject]);

  console.log(`🧠 Extended ${subject} lesson: ${allActivities.length} activities, targeting ${targetLessonLength} minutes`);

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
    resetProgress
  };
};
