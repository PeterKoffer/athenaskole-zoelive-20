
import { useEffect, useRef } from 'react';
import { LessonActivity } from './types/LessonTypes';

interface LessonActivitySpeechManagerProps {
  currentActivity: LessonActivity | undefined;
  currentActivityIndex: number;
  autoReadEnabled: boolean;
  isReady: boolean;
  speakText: (text: string, priority?: boolean) => void;
  stopSpeaking: () => void;
}

const LessonActivitySpeechManager = ({
  currentActivity,
  currentActivityIndex,
  autoReadEnabled,
  isReady,
  speakText,
  stopSpeaking
}: LessonActivitySpeechManagerProps) => {
  const lastSpokenActivityRef = useRef<string>('');
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  // Auto-speak when activity changes with strict duplicate prevention
  useEffect(() => {
    if (!currentActivity || !autoReadEnabled || !isReady || isProcessingRef.current) {
      return;
    }

    // Create unique activity identifier
    const activityKey = `${currentActivity.id}-${currentActivityIndex}`;
    const now = Date.now();
    
    // Prevent speaking the same activity multiple times
    if (lastSpokenActivityRef.current === activityKey) {
      return;
    }

    // Time-based prevention (don't speak too frequently)
    if (now - lastSpeechTimeRef.current < 5000) {
      console.log('🚫 Too soon since last speech, waiting...');
      return;
    }

    console.log('🎯 New activity detected for speech:', currentActivity.title);
    
    // Mark as processing to prevent race conditions
    isProcessingRef.current = true;
    lastSpokenActivityRef.current = activityKey;
    lastSpeechTimeRef.current = now;
    
    // Clear any existing timeouts
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    // Stop any current speech
    stopSpeaking();
    
    speechTimeoutRef.current = setTimeout(() => {
      let speechText = '';
      
      if (currentActivity.phase === 'content-delivery') {
        speechText = `Let me explain this concept: ${currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || currentActivity.title}`;
      } else if (currentActivity.phase === 'interactive-game') {
        const question = currentActivity.content.question || '';
        if (question.includes('dynamically generated') || question.trim().length === 0) {
          speechText = `Here's your practice question. Take your time to think about it.`;
        } else {
          speechText = `Here's your question: ${question}`;
        }
      } else if (currentActivity.phase === 'introduction') {
        speechText = `Welcome! ${currentActivity.content.hook || currentActivity.title}`;
      } else if (currentActivity.phase === 'application') {
        speechText = `Now let's apply what we've learned: ${currentActivity.content.scenario || currentActivity.title}`;
      } else if (currentActivity.phase === 'summary') {
        speechText = `Let's review: ${currentActivity.content.text || currentActivity.title}`;
      } else {
        speechText = `Let's work on: ${currentActivity.title}`;
      }
      
      // Only speak if we have meaningful content
      if (speechText && speechText.length > 10 && !speechText.includes('undefined')) {
        console.log('🔊 Speaking activity:', speechText.substring(0, 50) + '...');
        speakText(speechText, true);
      }
      
      // Reset processing flag after speech
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000);
      
    }, 3000); // Longer delay to prevent overwhelming

  }, [currentActivity?.id, currentActivityIndex, autoReadEnabled, isReady, speakText, stopSpeaking]);

  // Reset when lesson restarts
  useEffect(() => {
    if (currentActivityIndex === 0) {
      console.log('🔄 Resetting speech manager for new lesson');
      lastSpokenActivityRef.current = '';
      lastSpeechTimeRef.current = 0;
      isProcessingRef.current = false;
    }
  }, [currentActivityIndex]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      isProcessingRef.current = false;
    };
  }, []);

  return null;
};

export default LessonActivitySpeechManager;
