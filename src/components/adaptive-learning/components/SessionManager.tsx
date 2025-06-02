
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { progressPersistence } from "@/services/progressPersistence";

export interface SessionManagerProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onSessionReady: (sessionId: string) => void;
}

export interface SessionData {
  sessionId: string | null;
  timeSpent: number;
  setTimeSpent: (time: number | ((prev: number) => number)) => void;
}

export const useSessionManager = ({ subject, skillArea, difficultyLevel, onSessionReady }: SessionManagerProps): SessionData => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const initializeSession = async () => {
    if (!user?.id) return;

    const newSessionId = await progressPersistence.saveSession({
      user_id: user.id,
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel,
      start_time: new Date().toISOString(),
      time_spent: 0,
      score: 0,
      completed: false
    });

    if (newSessionId) {
      setSessionId(newSessionId);
      onSessionReady(newSessionId);
      console.log('Session initialized:', newSessionId);
    }
  };

  useEffect(() => {
    if (user?.id && !sessionId) {
      initializeSession();
    }
  }, [user?.id]);

  return {
    sessionId,
    timeSpent,
    setTimeSpent
  };
};

export const updateSessionProgress = async (sessionId: string, timeSpent: number, score: number) => {
  if (!sessionId) return;

  await progressPersistence.updateSession(sessionId, {
    end_time: new Date().toISOString(),
    time_spent: timeSpent,
    score,
    completed: true
  });

  console.log('Session completed:', {
    score,
    timeSpent
  });
};
