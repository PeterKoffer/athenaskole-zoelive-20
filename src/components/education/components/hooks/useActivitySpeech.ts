
import { useEffect, useCallback } from 'react';
import { useSimplifiedSpeech } from '@/components/adaptive-learning/hooks/useSimplifiedSpeech';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
  speech?: string;
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
    testSpeech,
    isSpeaking
  } = useSimplifiedSpeech();

  // Test speech when component mounts
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Activity speech system ready, testing in 2 seconds...');
      setTimeout(() => {
        testSpeech();
      }, 2000);
    }
  }, [isReady, autoReadEnabled, testSpeech]);

  // Speak activity content when it changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      console.log('🎯 New activity - Nelie will speak:', currentActivity.title);
      
      // Stop any current speech
      stopSpeaking();
      
      // Wait for UI to render, then speak
      setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.speech) {
          // Use custom speech if available
          speechText = currentActivity.speech;
        } else if (currentActivity.type === 'explanation') {
          speechText = `Let me explain: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your question: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Let's play a game! ${currentActivity.content.text || currentActivity.title}`;
        } else {
          speechText = `Let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          speakText(speechText, true);
        }
      }, 1500);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakText, stopSpeaking, isReady]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        const speechText = currentActivity.speech || `Let me read this for you: ${currentActivity.title}`;
        speakText(speechText, true);
      }
    }
  }, [currentActivity, isSpeaking, speakText, stopSpeaking]);

  return {
    autoReadEnabled,
    speakText,
    stopSpeaking,
    isReady,
    isSpeaking,
    handleReadRequest
  };
};
