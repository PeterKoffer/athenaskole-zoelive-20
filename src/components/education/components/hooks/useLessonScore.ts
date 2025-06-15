
import { useState } from 'react';

export const useLessonScore = () => {
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  return { score, setScore, correctStreak, setCorrectStreak };
};
