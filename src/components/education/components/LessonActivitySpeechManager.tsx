
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
  autoReadEnabled,
  isReady,
  speakText
}: LessonActivitySpeechManagerProps) => {
  const lastActivityId = useRef<string>('');
  const hasAutoSpoken = useRef<boolean>(false);

  // Reset auto-speech flag when activity changes
  useEffect(() => {
    if (currentActivity?.id !== lastActivityId.current) {
      lastActivityId.current = currentActivity?.id || '';
      hasAutoSpoken.current = false;
      console.log('🔄 New activity detected, resetting auto-speech flag');
    }
  }, [currentActivity?.id]);

  // Auto-speak when activity changes using ONLY Fena voice with deduplication
  useEffect(() => {
    if (
      currentActivity && 
      autoReadEnabled && 
      isReady && 
      !hasAutoSpoken.current &&
      currentActivity.id !== lastActivityId.current
    ) {
      hasAutoSpoken.current = true;
      
      // Use activity-specific context for deduplication
      const context = `activity-${currentActivity.id}-${currentActivity.phase}`;
      
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
          speechText = currentActivity.title;
        }
        
        if (speechText && speechText.trim()) {
          console.log('🎭 Auto-speaking activity with context:', context, speechText.substring(0, 50) + '...');
          // The speakText function will handle deduplication through UnifiedSpeechSystem
          speakText(speechText, true);
        }
      }, 800);
    }
  }, [currentActivity, autoReadEnabled, isReady, speakText]);

  return null; // This is a logic-only component
};

export default LessonActivitySpeechManager;
