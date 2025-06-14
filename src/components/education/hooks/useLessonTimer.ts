
import { useState, useRef, useEffect, useCallback } from 'react';

export const useLessonTimer = () => {
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [lessonStartTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSessionTimer(elapsed);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsTimerActive(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerActive(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerActive(true);
  }, []);

  return {
    sessionTimer,
    lessonStartTime,
    isTimerActive,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer
  };
};
