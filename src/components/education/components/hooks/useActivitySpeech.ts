
import { useEffect, useCallback } from 'react';
import { useReliableSpeech } from '@/components/adaptive-learning/hooks/useReliableSpeech';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
}

export const useActivitySpeech = (
  currentActivity: LessonActivity | undefined,
  currentActivityIndex: number,
  activityCompleted: boolean
) => {
  const {
    autoReadEnabled,
    speakText,
    stopSpeaking,
    isReady,
    testSpeech
  } = useReliableSpeech();

  // Test speech when component mounts
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Activity speech system ready, testing...');
      setTimeout(() => {
        testSpeech();
      }, 1000);
    }
  }, [isReady, autoReadEnabled, testSpeech]);

  // Speak activity content when it changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      console.log('🎯 Activity speech: speaking for activity', currentActivity.title);
      stopSpeaking();
      
      setTimeout(() => {
        if (currentActivity.type === 'explanation') {
          speakText(currentActivity.content.text, true);
        } else if (currentActivity.type === 'question') {
          const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
          speakText(questionText, true);
        } else if (currentActivity.type === 'game') {
          speakText(`Let's play a game! ${currentActivity.content.text}`, true);
        }
      }, 1500);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakText, stopSpeaking, isReady]);

  return {
    autoReadEnabled,
    speakText,
    stopSpeaking,
    isReady
  };
};
