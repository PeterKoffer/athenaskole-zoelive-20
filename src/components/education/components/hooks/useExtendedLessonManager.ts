
import { useCallback, useEffect } from 'react';
import { useLessonState } from './useLessonState';
import { useDynamicActivityGeneration } from './useDynamicActivityGeneration';
import { useLessonProgression } from './useLessonProgression';
import { useLessonContentGeneration } from './useLessonContentGeneration';

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
    dynamicActivities,
    setDynamicActivities,
    questionsGenerated,
    isGeneratingQuestion,
    generateDynamicActivity
  } = useDynamicActivityGeneration({
    subject,
    skillArea,
    timeElapsed
  });

  const { baseLessonActivities } = useLessonContentGeneration({ subject });

  // Combine base activities with dynamic ones
  const allActivities = [...baseLessonActivities, ...dynamicActivities];

  const {
    teachingEngine,
    currentActivity,
    handleActivityComplete,
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
    onLessonComplete
  });

  console.log(`🧠 Extended lesson: ${allActivities.length} activities, targeting ${targetLessonLength} minutes`);

  // Check if we need to extend the lesson
  const shouldExtendLesson = useCallback(() => {
    const currentMinutes = timeElapsed / 60;
    const remainingActivities = allActivities.length - currentActivityIndex - 1;
    const estimatedRemainingTime = remainingActivities * 3; // 3 minutes per activity average
    
    return currentMinutes + estimatedRemainingTime < targetLessonLength;
  }, [timeElapsed, allActivities.length, currentActivityIndex, targetLessonLength]);

  // Auto-generate more activities if lesson is too short
  useEffect(() => {
    if (currentActivityIndex > 2 && shouldExtendLesson() && dynamicActivities.length < 6 && !isGeneratingQuestion) {
      console.log('📚 Lesson seems short, generating additional content...');
      generateDynamicActivity().then(newActivity => {
        if (newActivity) {
          setDynamicActivities(prev => [...prev, newActivity]);
        }
      });
    }
  }, [currentActivityIndex, shouldExtendLesson, dynamicActivities.length, generateDynamicActivity, isGeneratingQuestion, setDynamicActivities]);

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
    handleReadRequest
  };
};
