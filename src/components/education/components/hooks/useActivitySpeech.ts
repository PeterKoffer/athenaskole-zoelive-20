
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
  const hasSpokenForActivityRef = useRef<Set<string>>(new Set());

  // Enhanced speech function with faster rate
  const speakTextFaster = useCallback((text: string, priority: boolean = true) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
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
        speechSynthesis.cancel();
      }
      speechSynthesis.speak(utterance);
    } else {
      speakText(text, priority);
    }
  }, [speakText]);

  // Test speech when component mounts - only once
  useEffect(() => {
    if (isReady && autoReadEnabled && !hasSpokenForActivityRef.current.has('welcome')) {
      console.log('🧪 Activity speech system ready, testing once...');
      hasSpokenForActivityRef.current.add('welcome');
      setTimeout(() => {
        speakTextFaster("Hello! I'm Nelie, your learning companion. Let's have an amazing lesson together!");
      }, 1500);
    }
  }, [isReady, autoReadEnabled, speakTextFaster]);

  // Speak activity content when it changes - with better duplicate prevention
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      // Prevent speaking the same activity multiple times
      if (hasSpokenForActivityRef.current.has(currentActivity.id)) {
        console.log('🚫 Activity already spoken, skipping:', currentActivity.id);
        return;
      }

      console.log('🎯 New activity - Nelie will speak:', currentActivity.title);
      
      // Clear any existing timeouts
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      
      // Stop any current speech
      stopSpeaking();
      
      // Mark this activity as being spoken
      hasSpokenForActivityRef.current.add(currentActivity.id);
      lastSpokenActivityRef.current = currentActivity.id;
      
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
          console.log('🔊 Speaking for activity:', currentActivity.type, currentActivity.id);
          speakTextFaster(speechText, true);
        }
      }, delay);
    }
  }, [currentActivity, autoReadEnabled, activityCompleted, isReady, speakTextFaster, stopSpeaking]);

  // Reset spoken activities when lesson restarts
  useEffect(() => {
    if (currentActivityIndex === 0) {
      hasSpokenForActivityRef.current.clear();
      lastSpokenActivityRef.current = null;
    }
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
