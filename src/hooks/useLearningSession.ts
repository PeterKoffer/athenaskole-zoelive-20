
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { progressPersistence } from '@/services/progressPersistence';

export const useLearningSession = (subject: string, activityType: string) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = useCallback(async (difficulty: number) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      const sessionData = {
        user_id: user.id,
        subject,
        skill_area: activityType,
        start_time: new Date().toISOString(),
        time_spent: 0,
        score: 0,
        difficulty_level: difficulty,
        completed: false,
        user_feedback: {
          accuracy: 0,
          averageResponseTime: 0,
          difficultyProgression: [],
          struggledConcepts: []
        }
      };

      const sessionId = await progressPersistence.saveSession(sessionData);
      setCurrentSession(sessionId);
      setSessionStartTime(new Date());
      return sessionId;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, subject, activityType]);

  const updateSession = useCallback(async (updates: any) => {
    if (!currentSession) return false;
    return await progressPersistence.updateSession(currentSession, updates);
  }, [currentSession]);

  const endSession = useCallback(async (finalScore: number, accuracy: number) => {
    if (!currentSession || !sessionStartTime || !user) return false;

    const duration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
    
    try {
      await progressPersistence.updateSession(currentSession, {
        end_time: new Date().toISOString(),
        time_spent: duration,
        score: finalScore,
        completed: true
      });

      setCurrentSession(null);
      setSessionStartTime(null);
      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }, [currentSession, sessionStartTime, user]);

  return {
    currentSession,
    sessionStartTime,
    isLoading,
    startSession,
    updateSession,
    endSession
  };
};
