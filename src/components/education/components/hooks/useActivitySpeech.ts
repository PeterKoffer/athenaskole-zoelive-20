
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
  const speechProtectionRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced speech function with faster rate
  const speakTextFaster = useCallback((text: string, priority: boolean = true) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3; // Increased from default 1.0 to 1.3 for faster speech
      utterance.pitch = 1.1; // Slightly higher pitch for Nelie's voice
      utterance.volume = 0.9;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      if (priority) {
        speechSynthesis.cancel(); // Stop current speech for priority
      }
      speechSynthesis.speak(utterance);
    } else {
      // Fallback to original method
      speakText(text, priority);
    }
  }, [speakText]);

  // Test speech when component mounts
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Activity speech system ready, testing in 1.5 seconds...');
      setTimeout(() => {
        speakTextFaster("Hello! I'm Nelie, your learning companion. Let's have an amazing lesson together!");
      }, 1500);
    }
  }, [isReady, autoReadEnabled, speakTextFaster]);

  // Speak activity content when it changes - with enhanced protection against interruption
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      // Don't speak the same activity twice
      if (lastSpokenActivityRef.current === currentActivity.id) {
        return;
      }

      console.log('🎯 New activity - Nelie will speak faster:', currentActivity.title);
      
      // Clear any existing timeouts
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (speechProtectionRef.current) {
        clearTimeout(speechProtectionRef.current);
      }
      
      // Stop any current speech
      stopSpeaking();
      
      // Mark this activity as being spoken
      lastSpokenActivityRef.current = currentActivity.id;
      
      // Reduced delay for faster lesson flow
      const delay = currentActivity.type === 'welcome' ? 2000 : 1000;
      
      speechTimeoutRef.current = setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.speech) {
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
          console.log('🔊 Starting faster speech for:', currentActivity.type);
          speakTextFaster(speechText, true);
          
          // Adjusted protection period for faster speech
          const estimatedSpeechDuration = speechText.split(' ').length * 400; // Reduced from 500ms to 400ms per word
          speechProtectionRef.current = setTimeout(() => {
            console.log('🛡️ Speech protection period ended');
          }, estimatedSpeechDuration);
        }
      }, delay);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakTextFaster, stopSpeaking, isReady]);

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
      if (speechProtectionRef.current) {
        clearTimeout(speechProtectionRef.current);
      }
    };
  }, []);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        const speechText = currentActivity.speech || currentActivity.content.message || `Let me read this for you: ${currentActivity.title}`;
        speakTextFaster(speechText, true);
      }
    }
  }, [currentActivity, isSpeaking, speakTextFaster, stopSpeaking]);

  return {
    autoReadEnabled,
    speakText: speakTextFaster,
    stopSpeaking,
    isReady,
    isSpeaking,
    handleReadRequest
  };
};
