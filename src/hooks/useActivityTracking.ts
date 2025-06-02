
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userActivityService } from '@/services/userActivityService';
import { realTimeProgressService } from '@/services/realTimeProgressService';

export const useActivityTracking = (
  sessionType: 'chat' | 'game' | 'lesson' | 'music_creation' | 'ai_tutor',
  subject?: string
) => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(async (metadata: any = {}) => {
    if (!user || isTracking) return;

    try {
      const sessionId = await userActivityService.startSession({
        user_id: user.id,
        session_type: sessionType,
        subject,
        completion_status: 'in_progress',
        start_time: new Date().toISOString(),
        metadata
      });

      if (sessionId) {
        setCurrentSessionId(sessionId);
        setSessionStartTime(new Date());
        setIsTracking(true);
        console.log(`Started tracking ${sessionType} session:`, sessionId);
      }
    } catch (error) {
      console.error('Error starting activity tracking:', error);
    }
  }, [user, sessionType, subject, isTracking]);

  const endTracking = useCallback(async (engagementScore?: number) => {
    if (!currentSessionId || !sessionStartTime || !user) return;

    try {
      const success = await userActivityService.endSession(currentSessionId, engagementScore);
      
      if (success && subject) {
        // Calculate completion time in minutes for progress tracking
        const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60);
        const isCorrect = engagementScore ? engagementScore > 70 : true; // Assume success if engagement is high
        
        await realTimeProgressService.updateProgress(
          user.id,
          subject,
          sessionType,
          isCorrect,
          sessionDuration * 60 // Convert back to seconds for the progress service
        );
      }

      setCurrentSessionId(null);
      setSessionStartTime(null);
      setIsTracking(false);
      console.log(`Ended tracking ${sessionType} session`);
    } catch (error) {
      console.error('Error ending activity tracking:', error);
    }
  }, [currentSessionId, sessionStartTime, user, subject, sessionType]);

  const abandonTracking = useCallback(async () => {
    if (!currentSessionId) return;

    try {
      await userActivityService.abandonSession(currentSessionId);
      setCurrentSessionId(null);
      setSessionStartTime(null);
      setIsTracking(false);
      console.log(`Abandoned tracking ${sessionType} session`);
    } catch (error) {
      console.error('Error abandoning activity tracking:', error);
    }
  }, [currentSessionId, sessionType]);

  // Auto-abandon session if user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTracking) {
        abandonTracking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTracking, abandonTracking]);

  return {
    isTracking,
    currentSessionId,
    sessionStartTime,
    startTracking,
    endTracking,
    abandonTracking
  };
};
