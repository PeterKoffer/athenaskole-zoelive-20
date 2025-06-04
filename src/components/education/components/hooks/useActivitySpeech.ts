
import { useEffect, useCallback } from 'react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
}

export const useActivitySpeech = (
  currentActivity: LessonActivity | undefined,
  currentActivityIndex: number,
  activityCompleted: boolean
) => {
  const {
    autoReadEnabled,
    speakText,
    stopSpeaking
  } = useSpeechSynthesis();

  // Speak activity content when it changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !activityCompleted) {
      stopSpeaking();
      
      setTimeout(() => {
        if (currentActivity.type === 'explanation') {
          speakText(currentActivity.content.text);
        } else if (currentActivity.type === 'question') {
          const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
          speakText(questionText);
        } else if (currentActivity.type === 'game') {
          speakText(`Let's play a game! ${currentActivity.content.text}`);
        }
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled, activityCompleted, currentActivity, speakText, stopSpeaking]);

  return {
    autoReadEnabled,
    speakText,
    stopSpeaking
  };
};
