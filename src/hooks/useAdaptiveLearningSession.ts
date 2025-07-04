
import { useState, useCallback, useEffect } from 'react';
import { LearningAtom, LearningAtomPerformance } from '@/types/learning';
import InSessionAdaptiveManager from '@/services/InSessionAdaptiveManager';
import { DifficultyLevel } from '@/services/AdaptiveDifficultyEngine';

interface AdaptiveSessionState {
  currentAtom: LearningAtom | null;
  isAdapting: boolean;
  adaptationReason: string | null;
  sessionStartTime: number;
  currentAttempt: number;
}

export const useAdaptiveLearningSession = (initialAtom: LearningAtom | null) => {
  const [sessionState, setSessionState] = useState<AdaptiveSessionState>({
    currentAtom: initialAtom,
    isAdapting: false,
    adaptationReason: null,
    sessionStartTime: Date.now(),
    currentAttempt: 0
  });

  const [responseStartTime, setResponseStartTime] = useState<number>(Date.now());

  // Initialize session when atom changes
  useEffect(() => {
    if (initialAtom) {
      InSessionAdaptiveManager.startAtomSession(initialAtom.id);
      setSessionState(prev => ({
        ...prev,
        currentAtom: initialAtom,
        sessionStartTime: Date.now(),
        currentAttempt: 0
      }));
      setResponseStartTime(Date.now());
    }
  }, [initialAtom?.id]);

  const recordResponse = useCallback((
    isCorrect: boolean,
    hintsUsed: number = 0
  ) => {
    if (!sessionState.currentAtom) return;

    const responseTime = (Date.now() - responseStartTime) / 1000;
    
    // Record the interaction
    InSessionAdaptiveManager.recordAtomInteraction(
      sessionState.currentAtom.id,
      isCorrect,
      responseTime,
      hintsUsed
    );

    // Check if we should adapt the atom
    const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(
      sessionState.currentAtom.id
    );

    if (adaptationCheck.shouldAdapt && adaptationCheck.newDifficulty && adaptationCheck.contentModifications) {
      console.log(`[useAdaptiveLearningSession] Adapting atom difficulty: ${adaptationCheck.reason}`);
      
      setSessionState(prev => ({
        ...prev,
        isAdapting: true,
        adaptationReason: adaptationCheck.reason || null
      }));

      // Generate adapted variant
      const adaptedAtom = InSessionAdaptiveManager.generateAdaptiveAtomVariant(
        sessionState.currentAtom,
        adaptationCheck.newDifficulty,
        adaptationCheck.contentModifications
      );

      // Update state with adapted atom
      setTimeout(() => {
        setSessionState(prev => ({
          ...prev,
          currentAtom: adaptedAtom,
          isAdapting: false,
          currentAttempt: prev.currentAttempt + 1
        }));
        setResponseStartTime(Date.now());
      }, 1500); // Brief pause to show adaptation message

    } else {
      setSessionState(prev => ({
        ...prev,
        currentAttempt: prev.currentAttempt + 1
      }));
      setResponseStartTime(Date.now());
    }
  }, [sessionState.currentAtom, responseStartTime]);

  const completeSession = useCallback((): LearningAtomPerformance | null => {
    if (!sessionState.currentAtom) return null;

    const performance = InSessionAdaptiveManager.endAtomSession(sessionState.currentAtom.id);
    
    setSessionState(prev => ({
      ...prev,
      currentAtom: null,
      isAdapting: false,
      adaptationReason: null
    }));

    return performance;
  }, [sessionState.currentAtom]);

  const getSessionMetrics = useCallback(() => {
    if (!sessionState.currentAtom) return null;
    return InSessionAdaptiveManager.getSessionSummary(sessionState.currentAtom.id);
  }, [sessionState.currentAtom]);

  return {
    currentAtom: sessionState.currentAtom,
    isAdapting: sessionState.isAdapting,
    adaptationReason: sessionState.adaptationReason,
    currentAttempt: sessionState.currentAttempt,
    sessionDurationSeconds: (Date.now() - sessionState.sessionStartTime) / 1000,
    recordResponse,
    completeSession,
    getSessionMetrics
  };
};
