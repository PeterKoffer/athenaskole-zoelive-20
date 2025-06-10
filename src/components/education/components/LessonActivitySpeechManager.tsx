
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
  const spokenActivitiesRef = useRef<Set<string>>(new Set());
  const lastSpeechTimeRef = useRef<number>(0);

  // Auto-speak when activity changes - with strict duplicate prevention
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
    const now = Date.now();
    
    // Multiple prevention checks
    if (spokenActivitiesRef.current.has(activityKey)) {
      console.log('🚫 Activity already spoken (set check):', activityKey);
      return;
    }

    if (lastSpokenActivityRef.current === activityKey) {
      console.log('🚫 Activity already spoken (ref check):', activityKey);
      return;
    }

    // Time-based prevention (don't speak too frequently)
    if (now - lastSpeechTimeRef.current < 3000) {
      console.log('🚫 Too soon since last speech, waiting...');
      return;
    }

    console.log('🎯 New activity detected, Nelie will speak:', currentActivity.title);
    
    // Mark as spoken immediately to prevent race conditions
    spokenActivitiesRef.current.add(activityKey);
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
        speechText = `Let me explain this step by step: ${currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || currentActivity.title}`;
      } else if (currentActivity.phase === 'interactive-game') {
        const question = currentActivity.content.question || '';
        // Don't speak placeholder or empty questions
        if (question.includes('dynamically generated') || question.trim().length === 0) {
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
      
      // Only speak if we have meaningful content
      if (speechText && speechText.length > 10 && !speechText.includes('undefined')) {
        console.log('🔊 Activity speech manager speaking:', speechText.substring(0, 50) + '...');
        speakText(speechText, true);
      } else {
        console.log('🚫 Skipping speech for insufficient content');
        // Remove from spoken set if we didn't actually speak
        spokenActivitiesRef.current.delete(activityKey);
      }
    }, 2000); // Longer delay to prevent overwhelming

  }, [currentActivity, currentActivityIndex, autoReadEnabled, isReady, speakText, stopSpeaking]);

  // Reset spoken activities when lesson restarts
  useEffect(() => {
    if (currentActivityIndex === 0) {
      console.log('🔄 Resetting spoken activities for new lesson');
      spokenActivitiesRef.current.clear();
      lastSpokenActivityRef.current = '';
      lastSpeechTimeRef.current = 0;
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
