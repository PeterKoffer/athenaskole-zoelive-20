
import { useCallback, useEffect, useState } from 'react';
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

  // Generate initial questions immediately when lesson starts
  useEffect(() => {
    if (!hasGeneratedInitialQuestions && !isGeneratingQuestion) {
      console.log('🎯 Starting initial question generation for lesson...');
      setHasGeneratedInitialQuestions(true);
      
      // Generate questions immediately to ensure interactive content
      const generateInitialQuestions = async () => {
        console.log('🔄 Generating 8 initial questions...');
        
        for (let i = 0; i < 8; i++) { // Generate 8 questions for good variety
          try {
            console.log(`📝 Generating question ${i + 1}/8...`);
            const newActivity = await generateDynamicActivity();
            if (newActivity) {
              setDynamicActivities(prev => {
                const updated = [...prev, newActivity];
                console.log(`✅ Added question ${i + 1}: ${newActivity.content.question.substring(0, 50)}...`);
                return updated;
              });
            } else {
              console.warn(`⚠️ Failed to generate question ${i + 1}`);
            }
          } catch (error) {
            console.error(`❌ Error generating question ${i + 1}:`, error);
          }
          
          // Small delay between generations to prevent overwhelming
          if (i < 7) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
        
        console.log('✅ Initial question generation completed');
        setIsInitializing(false);
      };
      
      generateInitialQuestions();
    }
  }, [hasGeneratedInitialQuestions, isGeneratingQuestion, generateDynamicActivity, setDynamicActivities]);

  // Check if we need to extend the lesson
  const shouldExtendLesson = useCallback(() => {
    const currentMinutes = timeElapsed / 60;
    const remainingActivities = allActivities.length - currentActivityIndex - 1;
    const estimatedRemainingTime = remainingActivities * 2; // 2 minutes per activity average
    
    return currentMinutes + estimatedRemainingTime < targetLessonLength && dynamicActivities.length < 12;
  }, [timeElapsed, allActivities.length, currentActivityIndex, targetLessonLength, dynamicActivities.length]);

  // Auto-generate more activities if lesson is too short
  useEffect(() => {
    if (currentActivityIndex > 0 && shouldExtendLesson() && !isGeneratingQuestion && !isInitializing) {
      console.log('📚 Lesson needs more content, generating additional questions...');
      generateDynamicActivity().then(newActivity => {
        if (newActivity) {
          setDynamicActivities(prev => [...prev, newActivity]);
          console.log('✅ Added additional question:', newActivity.content.question.substring(0, 50) + '...');
        }
      });
    }
  }, [currentActivityIndex, shouldExtendLesson, generateDynamicActivity, isGeneratingQuestion, setDynamicActivities, isInitializing]);

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
    isInitializing,
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
