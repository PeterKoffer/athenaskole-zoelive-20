
import { useState, useRef } from 'react';

export const useLessonState = () => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState<Date | null>(null);
  const lessonStartTime = useRef(Date.now());
  const targetLessonLength = 20; // 20 minutes

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
