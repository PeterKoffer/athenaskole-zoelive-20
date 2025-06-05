
import { useEffect, useRef } from 'react';
import { LessonActivity } from './EnhancedLessonContent';

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
  const lastSpokenActivityIndex = useRef(-1);

  // Auto-speak when activity changes - but only once per activity
  useEffect(() => {
    if (currentActivity && autoReadEnabled && isReady && 
        currentActivityIndex !== lastSpokenActivityIndex.current) {
      
      console.log('🎯 New activity detected, Nelie will speak:', currentActivity.title);
      lastSpokenActivityIndex.current = currentActivityIndex;
      
      // Stop any current speech and speak new content
      stopSpeaking();
      
      // Wait for UI to render, then speak
      setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.type === 'explanation') {
          speechText = `Let me explain: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your question: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Let's play a game! ${currentActivity.content.text || currentActivity.title}`;
        } else if (currentActivity.type === 'welcome') {
          speechText = `${currentActivity.content.message}`;
        } else {
          speechText = `Let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          console.log('🔊 Activity speech manager speaking:', speechText.substring(0, 50));
          speakText(speechText, true);
        }
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled, isReady, currentActivity, speakText, stopSpeaking]);

  return null;
};

export default LessonActivitySpeechManager;
