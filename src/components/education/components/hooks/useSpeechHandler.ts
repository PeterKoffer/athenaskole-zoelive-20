
import { useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

type UseSpeechHandlerProps = {
  currentActivity: LessonActivity | null;
  teachingEngine: any;
};

export const useSpeechHandler = ({
  currentActivity,
  teachingEngine
}: UseSpeechHandlerProps) => {
  return useCallback(() => {
    if (currentActivity && teachingEngine.isReady) {
      const textToRead =
        currentActivity.content?.text ||
        currentActivity.content?.question ||
        currentActivity.title;
      if (textToRead) {
        teachingEngine.speakWithPersonality(textToRead);
      }
    }
  }, [currentActivity, teachingEngine]);
};
