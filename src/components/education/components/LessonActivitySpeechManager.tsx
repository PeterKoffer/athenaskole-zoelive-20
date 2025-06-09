
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

  // Auto-speak when activity changes - with better duplicate prevention
  useEffect(() => {
    if (!currentActivity || !autoReadEnabled || !isReady) {
      console.log('🚫 Speech conditions not met:', { 
        hasActivity: !!currentActivity, 
        autoReadEnabled, 
        isReady 
      });
      return;
    }

    // Create unique activity identifier
    const activityKey = `${currentActivity.id}-${currentActivityIndex}`;
    
    // Prevent speaking the same activity multiple times
    if (lastSpokenActivityRef.current === activityKey) {
      console.log('🚫 Activity already spoken, skipping:', activityKey);
      return;
    }

    console.log('🎯 New activity detected, Nelie will speak:', currentActivity.title);
    lastSpokenActivityRef.current = activityKey;
    
    // Clear any existing timeouts
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    // Stop any current speech
    stopSpeaking();
    
    speechTimeoutRef.current = setTimeout(() => {
      let speechText = '';
      
      if (currentActivity.phase === 'content-delivery') {
        speechText = `Let me explain this step by step: ${currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || currentActivity.title}`;
      } else if (currentActivity.phase === 'interactive-game') {
        const question = currentActivity.content.question || '';
        // Don't speak placeholder text
        if (question.includes('dynamically generated')) {
          speechText = `Here's your next practice question. Take your time to think about it.`;
        } else {
          speechText = `Here's your question: ${question}`;
        }
      } else if (currentActivity.phase === 'introduction') {
        speechText = `Let's start with something fun! ${currentActivity.content.hook || currentActivity.title}`;
      } else if (currentActivity.phase === 'application') {
        speechText = `Now let's apply what we've learned: ${currentActivity.content.scenario || currentActivity.content.realWorldExample || currentActivity.title}`;
      } else if (currentActivity.phase === 'creative-exploration') {
        speechText = `Time to be creative! ${currentActivity.content.text || currentActivity.title}`;
      } else if (currentActivity.phase === 'summary') {
        speechText = `Let's review what we learned: ${currentActivity.content.text || currentActivity.title}`;
      } else {
        speechText = `Let's work on: ${currentActivity.title}`;
      }
      
      if (speechText && speechText.length > 5) {
        console.log('🔊 Activity speech manager speaking:', speechText.substring(0, 50) + '...');
        speakText(speechText, true);
      }
    }, 1500); // Consistent delay

  }, [currentActivity, currentActivityIndex, autoReadEnabled, isReady, speakText, stopSpeaking]);

  // Reset when lesson restarts
  useEffect(() => {
    if (currentActivityIndex === 0) {
      lastSpokenActivityRef.current = '';
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

  return null;
};

export default LessonActivitySpeechManager;
