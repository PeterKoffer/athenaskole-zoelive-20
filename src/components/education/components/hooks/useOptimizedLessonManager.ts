import { useEffect, useMemo, useState } from 'react';

interface UseOptimizedLessonManagerArgs {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  manualActivityIndex?: number;
}

// Lightweight stub to satisfy consumers; integrate real lesson logic later
export const useOptimizedLessonManager = ({
  subject: _subject,
  skillArea: _skillArea,
  onLessonComplete,
  manualActivityIndex,
}: UseOptimizedLessonManagerArgs) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const targetLessonLength = 30; // minutes

  const activities = useMemo(() => [] as any[], []);
  const totalRealActivities = activities.length;
  const currentActivity = activities[currentActivityIndex] ?? null;

  // Simulate a simple timer (stops at targetLessonLength)
  useEffect(() => {
    const id = setInterval(() => setTimeElapsed((t) => Math.min(t + 1, targetLessonLength * 60)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleActivityComplete = (_wasCorrect?: boolean) => {
    setScore((s) => s + (_wasCorrect ? 10 : 0));
    setCorrectStreak((st) => (_wasCorrect ? st + 1 : 0));
    if (currentActivityIndex < totalRealActivities - 1) {
      setCurrentActivityIndex((i) => i + 1);
    } else {
      onLessonComplete();
    }
  };

  const handleReadRequest = () => {};
  const isInitializing = false;
  const isCurrentActivityCompleted = false;
  const canNavigateForward = currentActivityIndex < totalRealActivities - 1;
  const canNavigateBack = currentActivityIndex > 0;
  const isSpeaking = false;
  const toggleMute = () => {};

  // Allow external navigation requests
  useEffect(() => {
    if (
      typeof manualActivityIndex === 'number' &&
      manualActivityIndex !== currentActivityIndex &&
      manualActivityIndex >= 0 &&
      manualActivityIndex < totalRealActivities
    ) {
      setCurrentActivityIndex(manualActivityIndex);
    }
  }, [manualActivityIndex, currentActivityIndex, totalRealActivities]);

  return {
    currentActivityIndex,
    totalRealActivities,
    currentActivity,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    isCurrentActivityCompleted,
    canNavigateForward,
    canNavigateBack,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    setCurrentActivityIndex,
  } as const;
};
