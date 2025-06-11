import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { gameAssignmentService } from '@/services/gameAssignmentService';

export interface GameTrackingMetrics {
  timeSpent: number;
  actionsPerformed: number;
  hintsUsed: number;
  attemptsBeforeSuccess: number;
  engagementLevel: 'low' | 'medium' | 'high';
}

export interface LearningOutcome {
  objectiveId: string;
  description: string;
  achieved: boolean;
  confidenceLevel: number; // 0-100
}

export const useGameTracking = (gameId: string, assignmentId?: string) => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [metrics, setMetrics] = useState<GameTrackingMetrics>({
    timeSpent: 0,
    actionsPerformed: 0,
    hintsUsed: 0,
    attemptsBeforeSuccess: 0,
    engagementLevel: 'medium'
  });
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([]);

  const startGameTracking = useCallback(async (subject: string, skillArea?: string) => {
    if (!user || isTracking) return null;

    try {
      const sessionId = await gameAssignmentService.startGameSession({
        user_id: user.id,
        game_id: gameId,
        assignment_id: assignmentId,
        subject,
        skill_area: skillArea,
        score: 0,
        completion_status: 'in_progress',
        engagement_metrics: {},
        performance_data: {}
      });

      if (sessionId) {
        setCurrentSessionId(sessionId);
        setSessionStartTime(new Date());
        setIsTracking(true);
        console.log(`Started tracking game session for ${gameId}:`, sessionId);
      }

      return sessionId;
    } catch (error) {
      console.error('Error starting game tracking:', error);
      return null;
    }
  }, [user, gameId, assignmentId, isTracking]);

  const endGameTracking = useCallback(async (
    finalScore: number,
    completedObjectives: LearningOutcome[] = []
  ) => {
    if (!currentSessionId || !sessionStartTime || !user) return false;

    try {
      // Calculate final engagement level
      const sessionDurationMinutes = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
      let engagementLevel: 'low' | 'medium' | 'high' = 'medium';
      
      if (sessionDurationMinutes < 2) engagementLevel = 'low';
      else if (sessionDurationMinutes > 10 && metrics.actionsPerformed > 50) engagementLevel = 'high';

      const finalMetrics = {
        ...metrics,
        timeSpent: sessionDurationMinutes * 60, // Convert to seconds
        engagementLevel
      };

      const achievedObjectives = completedObjectives
        .filter(obj => obj.achieved)
        .map(obj => obj.description);

      const success = await gameAssignmentService.endGameSession(
        currentSessionId,
        finalScore,
        achievedObjectives,
        finalMetrics,
        {
          learningOutcomes: completedObjectives,
          sessionDuration: sessionDurationMinutes,
          engagementScore: finalScore
        }
      );

      if (success) {
        setCurrentSessionId(null);
        setSessionStartTime(null);
        setIsTracking(false);
        console.log(`Ended tracking game session for ${gameId}`);
      }

      return success;
    } catch (error) {
      console.error('Error ending game tracking:', error);
      return false;
    }
  }, [currentSessionId, sessionStartTime, user, gameId, metrics]);

  const abandonGameTracking = useCallback(async () => {
    if (!currentSessionId) return false;

    try {
      const success = await gameAssignmentService.abandonGameSession(currentSessionId);
      if (success) {
        setCurrentSessionId(null);
        setSessionStartTime(null);
        setIsTracking(false);
        console.log(`Abandoned tracking game session for ${gameId}`);
      }
      return success;
    } catch (error) {
      console.error('Error abandoning game tracking:', error);
      return false;
    }
  }, [currentSessionId, gameId]);

  // Tracking utility functions
  const recordAction = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      actionsPerformed: prev.actionsPerformed + 1
    }));
  }, []);

  const recordHintUsed = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
  }, []);

  const recordAttempt = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      attemptsBeforeSuccess: prev.attemptsBeforeSuccess + 1
    }));
  }, []);

  const updateLearningOutcome = useCallback((objectiveId: string, achieved: boolean, confidence: number = 100) => {
    setLearningOutcomes(prev => {
      const existing = prev.find(obj => obj.objectiveId === objectiveId);
      if (existing) {
        return prev.map(obj => 
          obj.objectiveId === objectiveId 
            ? { ...obj, achieved, confidenceLevel: confidence }
            : obj
        );
      } else {
        return [...prev, {
          objectiveId,
          description: objectiveId, // This could be enhanced with actual descriptions
          achieved,
          confidenceLevel: confidence
        }];
      }
    });
  }, []);

  // Auto-abandon session if user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTracking) {
        abandonGameTracking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTracking, abandonGameTracking]);

  return {
    // Session state
    isTracking,
    currentSessionId,
    sessionStartTime,
    
    // Metrics
    metrics,
    learningOutcomes,
    
    // Session controls
    startGameTracking,
    endGameTracking,
    abandonGameTracking,
    
    // Tracking utilities
    recordAction,
    recordHintUsed,
    recordAttempt,
    updateLearningOutcome
  };
};