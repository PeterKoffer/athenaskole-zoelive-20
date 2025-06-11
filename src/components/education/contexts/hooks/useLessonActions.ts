
import { useCallback, useEffect } from 'react';
import { useEnhancedTeachingEngine } from '../../components/hooks/useEnhancedTeachingEngine';
import { LessonActivity } from '../../components/types/LessonTypes';
import { LessonPhase } from '../../hooks/useLessonStateManager';

interface UseLessonActionsProps {
  subject: string;
  sessionTimer: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
  currentActivity: LessonActivity | null;
  updatePhase: (phase: LessonPhase) => void;
  updateScore: (scoreUpdate: number | ((prev: number) => number)) => void;
  completeLesson: () => void;
  handleActivityCompleteBase: (wasCorrect?: boolean) => void;
  startTimer: () => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export const useLessonActions = ({
  subject,
  sessionTimer,
  correctStreak,
  score,
  lessonStartTime,
  currentActivity,
  updatePhase,
  updateScore,
  completeLesson,
  handleActivityCompleteBase,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer
}: UseLessonActionsProps) => {
  // Enhanced teaching engine
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed: sessionTimer,
    correctStreak,
    score,
    lessonStartTime
  });

  const handleLessonStart = useCallback(() => {
    updatePhase('lesson');
    startTimer();
    
    // Auto-speak first activity
    setTimeout(() => {
      if (currentActivity && teachingEngine.autoReadEnabled) {
        const welcomeMessage = `Welcome to your ${subject} lesson! Let's begin our learning journey together!`;
        teachingEngine.speakWithPersonality(welcomeMessage, 'encouragement');
      }
    }, 1000);
  }, [updatePhase, startTimer, currentActivity, teachingEngine, subject]);

  const handleLessonPause = useCallback(() => {
    updatePhase('paused');
    pauseTimer();
  }, [updatePhase, pauseTimer]);

  const handleLessonResume = useCallback(() => {
    updatePhase('lesson');
    resumeTimer();
  }, [updatePhase, resumeTimer]);

  const handleLessonComplete = useCallback(() => {
    updatePhase('completed');
    stopTimer();
    completeLesson();
  }, [updatePhase, stopTimer, completeLesson]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        updateScore(prev => prev + 10);
        setTimeout(() => {
          teachingEngine.speakWithPersonality("Excellent work! You're doing fantastic!", 'encouragement');
        }, 500);
      } else {
        setTimeout(() => {
          teachingEngine.speakWithPersonality("That's okay! Learning takes practice. Let's keep going!", 'encouragement');
        }, 500);
      }
    }

    handleActivityCompleteBase(wasCorrect);
  }, [updateScore, teachingEngine, handleActivityCompleteBase]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      let speechText: string;
      let context: 'question' | 'explanation' | 'encouragement' | 'humor' = 'explanation';
      
      if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.text || currentActivity.content.segments?.[0]?.explanation || '';
        context = 'explanation';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
        context = 'question';
      } else if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || `Welcome to your ${subject} lesson!`;
        context = 'humor';
      } else {
        speechText = `Let me explain this step by step: ${currentActivity.title}`;
        context = 'explanation';
      }
      
      teachingEngine.speakWithPersonality(speechText, context);
    }
  }, [currentActivity, teachingEngine, subject]);

  return {
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete,
    handleActivityComplete,
    handleReadRequest,
    teachingEngine
  };
};
