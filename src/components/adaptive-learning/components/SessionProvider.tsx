
import React, { useState, createContext, ReactNode } from 'react';

interface SessionState {
  sessionId: string;
  isActive: boolean;
  startTime: Date;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  conceptsCovered: string[];
  learningObjectives?: string[];
}

interface SessionContextType {
  session: SessionState | null;
  updateSession: (updates: Partial<SessionState>) => void;
  startSession: (config: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    totalQuestions: number;
  }) => void;
  endSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<SessionState | null>(null);

  const updateSession = (updates: Partial<SessionState>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  };

  const startSession = (config: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    totalQuestions: number;
  }) => {
    const newSession: SessionState = {
      sessionId: `session-${Date.now()}`,
      isActive: true,
      startTime: new Date(),
      currentQuestionIndex: 0,
      totalQuestions: config.totalQuestions,
      correctAnswers: 0,
      subject: config.subject,
      skillArea: config.skillArea,
      difficultyLevel: config.difficultyLevel,
      conceptsCovered: [],
      learningObjectives: []
    };
    setSession(newSession);
  };

  const endSession = () => {
    setSession(prev => prev ? { ...prev, isActive: false } : null);
  };

  return (
    <SessionContext.Provider value={{
      session,
      updateSession,
      startSession,
      endSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
