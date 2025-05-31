
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { progressPersistence, LearningSession, UserProgress } from '@/services/progressPersistence';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  totalAttempts: number;
}

interface AdaptiveLearningState {
  currentSession: string | null;
  difficulty: number;
  performanceMetrics: PerformanceMetrics;
  userProgress: UserProgress | null;
  isLoading: boolean;
  recommendedSessionTime: number;
  sessionStartTime: Date | null;
}

export const useAdaptiveLearning = (subject: string, activityType: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<AdaptiveLearningState>({
    currentSession: null,
    difficulty: 1,
    performanceMetrics: {
      accuracy: 0,
      averageTime: 0,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalAttempts: 0
    },
    userProgress: null,
    isLoading: true,
    recommendedSessionTime: 20, // minutes
    sessionStartTime: null
  });

  // Initialize adaptive learning session
  const initializeSession = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get user progress
      const userProgress = await progressPersistence.getUserProgress(user.id, subject);
      
      // Create new session
      const sessionData = {
        user_id: user.id,
        subject,
        activity_type: activityType,
        start_time: new Date().toISOString(),
        duration_minutes: 0,
        questions_answered: 0,
        correct_answers: 0,
        difficulty_level: userProgress?.current_level || 1,
        completed: false,
        performance_metrics: {
          accuracy: 0,
          averageResponseTime: 0,
          difficultyProgression: [],
          struggledConcepts: []
        }
      };

      const sessionId = await progressPersistence.saveSession(sessionData);

      // Calculate recommended session time based on user's past performance
      const recommendedTime = calculateRecommendedSessionTime(userProgress);

      setState(prev => ({
        ...prev,
        currentSession: sessionId,
        difficulty: userProgress?.current_level || 1,
        userProgress,
        recommendedSessionTime: recommendedTime,
        sessionStartTime: new Date(),
        isLoading: false
      }));

    } catch (error) {
      console.error('Error initializing adaptive learning session:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, subject, activityType]);

  // Record an answer
  const recordAnswer = useCallback(async (isCorrect: boolean, responseTime: number) => {
    if (!state.currentSession) return;

    const newMetrics = {
      ...state.performanceMetrics,
      totalAttempts: state.performanceMetrics.totalAttempts + 1,
      consecutiveCorrect: isCorrect ? state.performanceMetrics.consecutiveCorrect + 1 : 0,
      consecutiveIncorrect: isCorrect ? 0 : state.performanceMetrics.consecutiveIncorrect + 1,
    };

    // Calculate new accuracy
    const totalCorrect = isCorrect 
      ? (state.performanceMetrics.accuracy * state.performanceMetrics.totalAttempts / 100) + 1
      : (state.performanceMetrics.accuracy * state.performanceMetrics.totalAttempts / 100);
    
    newMetrics.accuracy = (totalCorrect / newMetrics.totalAttempts) * 100;

    // Calculate average response time
    const currentAvgTime = state.performanceMetrics.averageTime;
    newMetrics.averageTime = currentAvgTime === 0 
      ? responseTime 
      : (currentAvgTime * (newMetrics.totalAttempts - 1) + responseTime) / newMetrics.totalAttempts;

    setState(prev => ({
      ...prev,
      performanceMetrics: newMetrics
    }));

    // Update session in database
    await progressPersistence.updateSession(state.currentSession, {
      questions_answered: newMetrics.totalAttempts,
      correct_answers: Math.round(newMetrics.accuracy * newMetrics.totalAttempts / 100),
      performance_metrics: {
        accuracy: newMetrics.accuracy,
        averageResponseTime: newMetrics.averageTime,
        difficultyProgression: [state.difficulty],
        struggledConcepts: []
      }
    });

  }, [state.currentSession, state.performanceMetrics, state.difficulty]);

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

  // End session
  const endSession = useCallback(async () => {
    if (!state.currentSession || !user || !state.sessionStartTime) return;

    const duration = Math.round((new Date().getTime() - state.sessionStartTime.getTime()) / 1000 / 60);
    
    // Update session as completed
    await progressPersistence.updateSession(state.currentSession, {
      end_time: new Date().toISOString(),
      duration_minutes: duration,
      completed: true
    });

    // Update user progress
    const progressUpdate: Partial<UserProgress> = {
      user_id: user.id,
      subject,
      current_level: state.difficulty,
      total_time_spent: (state.userProgress?.total_time_spent || 0) + duration,
      sessions_completed: (state.userProgress?.sessions_completed || 0) + 1,
      average_accuracy: state.performanceMetrics.accuracy,
      last_session_date: new Date().toISOString(),
      preferred_difficulty: state.difficulty
    };

    await progressPersistence.updateUserProgress(progressUpdate);

    setState(prev => ({
      ...prev,
      currentSession: null,
      sessionStartTime: null
    }));

  }, [state.currentSession, state.sessionStartTime, state.difficulty, state.performanceMetrics.accuracy, state.userProgress, user, subject]);

  // Calculate recommended session time based on user progress
  const calculateRecommendedSessionTime = (userProgress: UserProgress | null): number => {
    if (!userProgress) return 20; // Default 20 minutes for new users

    const { average_accuracy, sessions_completed, total_time_spent } = userProgress;
    
    // Base time on past performance
    let recommendedTime = 20;

    // Adjust based on accuracy
    if (average_accuracy > 80) {
      recommendedTime += 5; // Longer sessions for high performers
    } else if (average_accuracy < 60) {
      recommendedTime -= 5; // Shorter sessions for struggling learners
    }

    // Adjust based on experience
    if (sessions_completed > 10) {
      recommendedTime += 5; // Experienced learners can handle longer sessions
    }

    // Consider average session length
    if (sessions_completed > 0) {
      const avgSessionLength = total_time_spent / sessions_completed;
      recommendedTime = Math.round((recommendedTime + avgSessionLength) / 2);
    }

    return Math.max(10, Math.min(40, recommendedTime)); // Between 10-40 minutes
  };

  useEffect(() => {
    if (user) {
      initializeSession();
    }
  }, [user, initializeSession]);

  return {
    ...state,
    initializeSession,
    recordAnswer,
    adjustDifficulty,
    endSession
  };
};
