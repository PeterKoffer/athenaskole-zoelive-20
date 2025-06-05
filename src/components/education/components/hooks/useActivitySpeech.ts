
import { useEffect, useCallback, useRef } from 'react';
import { useSimplifiedSpeech } from '@/components/adaptive-learning/hooks/useSimplifiedSpeech';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice' | 'welcome';
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

  const lastSpokenActivityRef = useRef<string | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Test speech when component mounts
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Activity speech system ready, testing in 2 seconds...');
      setTimeout(() => {
        testSpeech();
      }, 2000);
    }
  }, [isReady, autoReadEnabled, testSpeech]);

  // Speak activity content when it changes - with protection against interruption
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      // Don't speak the same activity twice
      if (lastSpokenActivityRef.current === currentActivity.id) {
        return;
      }

      console.log('🎯 New activity - Nelie will speak:', currentActivity.title);
      
      // Clear any existing speech timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      
      // Stop any current speech
      stopSpeaking();
      
      // Mark this activity as being spoken
      lastSpokenActivityRef.current = currentActivity.id;
      
      // Wait for UI to render, then speak with longer delay for welcome messages
      const delay = currentActivity.type === 'welcome' ? 2000 : 1500;
      
      speechTimeoutRef.current = setTimeout(() => {
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
        } else if (currentActivity.type === 'welcome') {
          speechText = currentActivity.content.message;
        } else {
          speechText = `Let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          speakText(speechText, true);
        }
      }, delay);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakText, stopSpeaking, isReady]);

  // Reset spoken activity tracker when activity changes
  useEffect(() => {
    return () => {
      lastSpokenActivityRef.current = null;
    };
  }, [currentActivityIndex]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        const speechText = currentActivity.speech || currentActivity.content.message || `Let me read this for you: ${currentActivity.title}`;
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
