
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { progressPersistence, UserProgress } from '@/services/progressPersistence';
import { useToast } from '@/hooks/use-toast';
import { usePerformanceMetrics } from './usePerformanceMetrics';
import { useLearningSession } from './useLearningSession';
import { calculateRecommendedSessionTime } from '@/utils/adaptiveLearningUtils';

interface AdaptiveLearningState {
  difficulty: number;
  userProgress: UserProgress | null;
  isLoading: boolean;
  recommendedSessionTime: number;
}

export const useAdaptiveLearning = (subject: string, activityType: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { metrics, recordAnswer: recordMetrics, resetMetrics } = usePerformanceMetrics();
  const { currentSession, sessionStartTime, startSession, updateSession, endSession } = useLearningSession(subject, activityType);
  
  const [state, setState] = useState<AdaptiveLearningState>({
    difficulty: 1,
    userProgress: null,
    isLoading: true,
    recommendedSessionTime: 20
  });

  // Initialize adaptive learning session
  const initializeSession = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const userProgress = await progressPersistence.getUserProgress(user.id, subject);
      const recommendedTime = calculateRecommendedSessionTime(userProgress);
      const initialDifficulty = userProgress?.current_level || 1;

      await startSession(initialDifficulty);

      setState(prev => ({
        ...prev,
        difficulty: initialDifficulty,
        userProgress,
        recommendedSessionTime: recommendedTime,
        isLoading: false
      }));

    } catch (error) {
      console.error('Error initializing adaptive learning session:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, subject, startSession]);

  // Record an answer
  const recordAnswer = useCallback(async (isCorrect: boolean, responseTime: number) => {
    if (!currentSession) return;

    recordMetrics(isCorrect, responseTime);

    // Update session in database
    await updateSession({
      score: Math.round(metrics.accuracy * metrics.totalAttempts / 100),
      user_feedback: {
        accuracy: metrics.accuracy,
        averageResponseTime: metrics.averageTime,
        difficultyProgression: [state.difficulty],
        struggledConcepts: []
      }
    });

  }, [currentSession, recordMetrics, updateSession, metrics, state.difficulty]);

  // Adjust difficulty based on performance
  const adjustDifficulty = useCallback((newLevel: number, reason: string) => {
    setState(prev => ({
      ...prev,
      difficulty: Math.max(1, Math.min(5, newLevel))
    }));

    toast({
      title: "Difficulty Adjusted",
      description: reason,
      duration: 3000
    });
  }, [toast]);

  // End session and update progress
  const completeSession = useCallback(async () => {
    if (!user) return;

    const finalScore = Math.round(metrics.accuracy * metrics.totalAttempts / 100);
    await endSession(finalScore, metrics.accuracy);

    // Update user progress
    const progressUpdate = {
      user_id: user.id,
      subject,
      current_level: state.difficulty,
      accuracy_rate: metrics.accuracy,
      last_assessment: new Date().toISOString()
    };

    await progressPersistence.updateUserProgress(progressUpdate);
    resetMetrics();

  }, [user, subject, state.difficulty, metrics, endSession, resetMetrics]);

  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user, initializeSession]);

  return {
    currentSession,
    difficulty: state.difficulty,
    performanceMetrics: metrics,
    userProgress: state.userProgress,
    isLoading: state.isLoading,
    recommendedSessionTime: state.recommendedSessionTime,
    sessionStartTime,
    initializeSession,
    recordAnswer,
    adjustDifficulty,
    endSession: completeSession
  };
};
