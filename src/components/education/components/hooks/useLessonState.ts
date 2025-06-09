
import { useState } from 'react';

export const useLessonState = () => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [targetLessonLength] = useState(18); // 18 minutes target

  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  return {
    currentActivityIndex,
    setCurrentActivityIndex,
    lessonStartTime,
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
