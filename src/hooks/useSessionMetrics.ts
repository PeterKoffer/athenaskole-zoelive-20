
import { useState } from 'react';

export const useSessionMetrics = () => {
  const [sessionScore, setSessionScore] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);

  const resetMetrics = () => {
    setSessionScore(0);
    setQuestionsCompleted(0);
  };

  const calculateFinalScore = () => {
    return questionsCompleted > 0 ? Math.round(sessionScore / questionsCompleted) : 0;
  };

  return {
    sessionScore,
    questionsCompleted,
    setSessionScore,
    setQuestionsCompleted,
    resetMetrics,
    calculateFinalScore
  };
};
