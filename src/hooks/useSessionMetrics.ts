
import { useState } from 'react';

export const useSessionMetrics = () => {
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalResponseTime, setTotalResponseTime] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);

  const updateMetrics = (isCorrect: boolean, responseTime: number) => {
    setQuestionsCompleted(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setTotalResponseTime(prev => prev + responseTime);
  };

  const resetMetrics = () => {
    setQuestionsCompleted(0);
    setCorrectAnswers(0);
    setTotalResponseTime(0);
    setSessionScore(0);
  };

  const calculateFinalScore = () => {
    if (questionsCompleted === 0) return 0;
    return Math.round((correctAnswers / questionsCompleted) * 100);
  };

  return {
    questionsCompleted,
    correctAnswers,
    totalResponseTime,
    sessionScore,
    setSessionScore,
    setQuestionsCompleted,
    updateMetrics,
    resetMetrics,
    calculateFinalScore
  };
};
