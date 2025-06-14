
import { useEffect, useRef } from 'react';
import { LessonActivity } from './types/LessonTypes';

interface LessonActivitySpeechManagerProps {
  currentActivity: LessonActivity;
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
  const lastActivityIndex = useRef<number>(-1);
  const hasSpoken = useRef<boolean>(false);

  // Reset speech flag when activity index changes (or lesson restarts)
  useEffect(() => {
    if (currentActivityIndex !== lastActivityIndex.current) {
      lastActivityIndex.current = currentActivityIndex;
      hasSpoken.current = false;
    }
  }, [currentActivityIndex]);

  // Auto-speak when activity changes (faster timing - 10 seconds per line)
  useEffect(() => {
    if (
      currentActivity && 
      autoReadEnabled && 
      isReady && 
      !hasSpoken.current
    ) {
      hasSpoken.current = true;

      setTimeout(() => {
        let speechText = '';

        if (currentActivity.phase === 'introduction') {
          speechText = currentActivity.content.hook || `Welcome to your ${currentActivity.title} lesson!`;
        } else if (currentActivity.phase === 'content-delivery') {
          speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
        } else if (currentActivity.phase === 'interactive-game') {
          speechText = `Time for an interactive challenge! ${currentActivity.content.question || ''}`;
        } else if (currentActivity.phase === 'application') {
          speechText = `Let's apply what we've learned! ${currentActivity.content.scenario || currentActivity.content.text || ''}`;
        } else if (currentActivity.phase === 'creative-exploration') {
          speechText = `Time to be creative! ${currentActivity.content.creativePrompt || currentActivity.content.text || ''}`;
        } else if (currentActivity.phase === 'summary') {
          speechText = `Great work! Let's review what we've learned.`;
        } else {
          // Use message or title for a welcome activity
          speechText = currentActivity.content?.message || currentActivity.title;
        }

        if (speechText && speechText.trim()) {
          console.log('🔊 Auto-speaking (math welcome/faster timing):', speechText.substring(0, 50) + '...');
          speakText(speechText, true);
        }
      }, 800); // Reduced from 1500ms to 800ms for faster response
    }
  }, [currentActivity, autoReadEnabled, isReady, speakText]);

  return null; // This is a logic-only component
};

export default LessonActivitySpeechManager;
