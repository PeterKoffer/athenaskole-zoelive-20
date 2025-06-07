
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
        
        if (currentActivity.phase === 'content-delivery') {
          speechText = `Let me explain: ${currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || ''}`;
        } else if (currentActivity.phase === 'interactive-game') {
          speechText = `Here's your question: ${currentActivity.content.question || ''}`;
        } else if (currentActivity.phase === 'introduction') {
          speechText = `Let's play a game! ${currentActivity.content.hook || currentActivity.title}`;
        } else if (currentActivity.phase === 'application') {
          speechText = `${currentActivity.content.scenario || currentActivity.content.realWorldExample || ''}`;
        } else if (currentActivity.phase === 'creative-exploration') {
          speechText = `Let's explore creatively: ${currentActivity.content.text || currentActivity.title}`;
        } else if (currentActivity.phase === 'summary') {
          speechText = `Let's review what we learned: ${currentActivity.content.text || currentActivity.title}`;
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
