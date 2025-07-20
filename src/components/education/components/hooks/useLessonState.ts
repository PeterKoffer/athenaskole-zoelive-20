
import { useState, useRef } from 'react';
import { DEFAULT_LESSON_MINUTES } from '@/constants/lesson';

export const useLessonState = () => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState<Date | null>(null);
  const lessonStartTime = useRef(Date.now());
  const targetLessonLength = DEFAULT_LESSON_MINUTES;

  const timeElapsed = Math.floor((Date.now() - lessonStartTime.current) / 1000 / 60);

  return {
    currentActivityIndex,
    setCurrentActivityIndex,
    lessonStartTime: lessonStartTime.current,
    score,
    setScore,
    correctStreak,
    setCorrectStreak,
    lastResponseTime,
    setLastResponseTime,
    targetLessonLength,
    timeElapsed
  };
};
