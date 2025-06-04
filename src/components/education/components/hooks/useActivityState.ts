
import { useState, useEffect } from 'react';

export const useActivityState = (currentActivityIndex: number) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);

  // Reset states when activity changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setActivityCompleted(false);
  }, [currentActivityIndex]);

  return {
    selectedAnswer,
    setSelectedAnswer,
    showResult,
    setShowResult,
    activityCompleted,
    setActivityCompleted
  };
};
