
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type SessionState = 'loading' | 'active' | 'completed';

export const useSessionLifecycle = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<SessionState>('loading');
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionKey, setCurrentQuestionKey] = useState(0);

  const initializeSession = () => {
    if (user) {
      setCurrentSession('active');
    }
  };

  const completeSession = () => {
    setCurrentSession('completed');
    setShowResults(true);
  };

  const resetSession = () => {
    setCurrentSession('loading');
    setShowResults(false);
    setCurrentQuestionKey(prev => prev + 1);
    
    // Re-initialize after reset
    setTimeout(() => {
      if (user) {
        setCurrentSession('active');
      }
    }, 1000);
  };

  return {
    currentSession,
    showResults,
    currentQuestionKey,
    initializeSession,
    completeSession,
    resetSession,
    setCurrentSession
  };
};
