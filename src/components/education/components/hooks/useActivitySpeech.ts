import { useEffect, useCallback, useRef } from 'react';
import { useSimplifiedSpeech } from '@/hooks/useSimplifiedSpeech';

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
    isSpeaking
  } = useSimplifiedSpeech();

  const lastSpokenActivityRef = useRef<string | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenForActivityRef = useRef<Set<string>>(new Set());
  const welcomeSpokenRef = useRef<boolean>(false);

  // Enhanced speech function with slower, more natural pace
  const speakTextSlower = useCallback((text: string, priority: boolean = true) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Much slower for better comprehension
      utterance.pitch = 1.0; // More natural pitch
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

  // Welcome message - only once per session
  useEffect(() => {
    if (isReady && autoReadEnabled && !welcomeSpokenRef.current) {
      console.log('🧪 Nelie welcoming student - first time only');
      welcomeSpokenRef.current = true;
      setTimeout(() => {
        speakTextSlower("Hello! I'm Nelie, your learning companion. Let's take our time and have an amazing lesson together!");
      }, 2000);
    }
  }, [isReady, autoReadEnabled, speakTextSlower]);

  // Speak activity content when it changes - with strict duplicate prevention
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted && isReady) {
      // Create unique activity identifier
      const activityKey = `${currentActivity.id}-${currentActivityIndex}`;
      
      // Prevent speaking the same activity multiple times
      if (hasSpokenForActivityRef.current.has(activityKey)) {
        console.log('🚫 Activity already spoken, skipping:', activityKey);
        return;
      }

      // Additional check to prevent immediate repetition
      if (lastSpokenActivityRef.current === activityKey) {
        console.log('🚫 Same activity as last spoken, skipping:', activityKey);
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
      hasSpokenForActivityRef.current.add(activityKey);
      lastSpokenActivityRef.current = activityKey;
      
      const delay = currentActivity.type === 'welcome' ? 2500 : 1500; // Longer delays
      
      speechTimeoutRef.current = setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.speech) {
          speechText = currentActivity.speech;
        } else if (currentActivity.type === 'explanation') {
          speechText = `Let me explain this step by step: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your next question. Take your time: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Let's try this fun activity: ${currentActivity.content.text || currentActivity.title}`;
        } else if (currentActivity.type === 'welcome') {
          speechText = currentActivity.content.message;
        } else {
          speechText = `Now let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          console.log('🔊 Speaking for activity:', currentActivity.type, activityKey);
          speakTextSlower(speechText, true);
        }
      }, delay);
    }
  }, [currentActivity, autoReadEnabled, activityCompleted, isReady, speakTextSlower, stopSpeaking, currentActivityIndex]);

  // Reset spoken activities when lesson restarts, but keep welcome spoken
  useEffect(() => {
    if (currentActivityIndex === 0) {
      hasSpokenForActivityRef.current.clear();
      lastSpokenActivityRef.current = null;
      // Don't reset welcomeSpokenRef to prevent re-welcome
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
        speakTextSlower(speechText, true);
      }
    }
  }, [currentActivity, isSpeaking, speakTextSlower, stopSpeaking]);

  return {
    autoReadEnabled,
    speakText: speakTextSlower,
    stopSpeaking,
    isReady,
    isSpeaking,
    handleReadRequest
  };
};
