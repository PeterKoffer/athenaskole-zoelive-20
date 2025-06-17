
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonTimer } from '../../hooks/useLessonTimer';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useLessonActivityGenerator } from './useLessonActivityGenerator';

interface UseUnifiedLessonTemplateProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useUnifiedLessonTemplate = ({
  subject,
  skillArea,
  onLessonComplete
}: UseUnifiedLessonTemplateProps) => {
  const { user } = useAuth();
  const { generateUnifiedLessonActivities } = useLessonActivityGenerator({ subject, skillArea });
  
  const [allActivities] = useState(() => {
    console.log(`🚀 Initializing unified lesson for ${subject}`);
    return generateUnifiedLessonActivities();
  });
  
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());

  const { sessionTimer, startTimer, stopTimer } = useLessonTimer();
  const { speakAsNelie, isSpeaking, isEnabled, toggleEnabled, forceStopAll } = useUnifiedSpeech();

  const targetLessonLength = 1200; // 20 minutes
  const currentActivity = allActivities[currentActivityIndex] || null;

  // Debug current activity
  useEffect(() => {
    console.log(`🎭 Current activity for ${subject}:`, {
      index: currentActivityIndex,
      activity: currentActivity,
      hasQuestion: !!currentActivity?.content?.question,
      hasOptions: !!currentActivity?.content?.options,
      activityType: currentActivity?.type,
      activityPhase: currentActivity?.phase
    });
  }, [currentActivity, currentActivityIndex, subject]);

  // Start timer when lesson begins
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
      forceStopAll();
    };
  }, [startTimer, stopTimer, forceStopAll]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('🎯 Unified lesson activity completed:', {
      subject,
      activityIndex: currentActivityIndex,
      wasCorrect,
      activityTitle: currentActivity?.title
    });

    // Mark as completed
    setCompletedActivities(prev => new Set([...prev, currentActivityIndex]));

    // Update score and streak
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setScore(prev => prev + 10);
        setCorrectStreak(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Check if lesson is complete
    if (currentActivityIndex >= allActivities.length - 1) {
      console.log('🎓 Unified lesson completed for', subject);
      setTimeout(() => {
        onLessonComplete();
      }, 2000);
      return;
    }

    // Advance to next activity
    setTimeout(() => {
      setCurrentActivityIndex(prev => prev + 1);
    }, 2000);
  }, [currentActivityIndex, allActivities.length, currentActivity, subject, onLessonComplete]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      const text = currentActivity.content.question || 
                  currentActivity.content.text ||
                  currentActivity.content.creativePrompt ||
                  currentActivity.content.scenario ||
                  currentActivity.title;
      
      if (isSpeaking) {
        forceStopAll();
      } else {
        speakAsNelie(text, true);
      }
    }
  }, [currentActivity, isSpeaking, speakAsNelie, forceStopAll]);

  return {
    currentActivityIndex,
    currentActivity,
    totalRealActivities: allActivities.length,
    timeElapsed: sessionTimer,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing: false,
    isCurrentActivityCompleted: completedActivities.has(currentActivityIndex),
    canNavigateForward: currentActivityIndex < allActivities.length - 1,
    canNavigateBack: currentActivityIndex > 0,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute: toggleEnabled,
    setCurrentActivityIndex
  };
};
