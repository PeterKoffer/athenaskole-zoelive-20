
import { useState, useEffect, useCallback } from 'react';

export const useQuestionTimer = (initialTime: number, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = useCallback((time: number) => {
    setTimeLeft(time);
    setStartTime(new Date());
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback((time: number) => {
    setTimeLeft(time);
    setStartTime(null);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      onTimeUp();
      setIsRunning(false);
    }
  }, [timeLeft, isRunning, onTimeUp]);

  return {
    timeLeft,
    startTime,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
};
