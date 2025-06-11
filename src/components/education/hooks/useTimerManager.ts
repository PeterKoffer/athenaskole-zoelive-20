
import { useState, useRef, useEffect, useCallback } from 'react';

interface TimerConfig {
  autoStart?: boolean;
  onTick?: (timeElapsed: number) => void;
}

export const useTimerManager = (config: TimerConfig = {}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(config.autoStart || false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setTimeElapsed(elapsed);
        if (config.onTick) {
          config.onTick(elapsed);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, config]);

  const startTimer = useCallback(() => {
    startTime.current = Date.now();
    setIsActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeElapsed(0);
    startTime.current = Date.now();
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timeElapsed,
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
};
