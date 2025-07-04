
import { useState, useCallback, useEffect } from 'react';
import { LearningAtom, LearningAtomPerformance } from '@/types/learning';
import InSessionAdaptiveManager from '@/services/InSessionAdaptiveManager';
import AdaptiveDifficultyEngine, { DifficultyLevel } from '@/services/AdaptiveDifficultyEngine';
import UniverseSessionManager from '@/services/UniverseSessionManager';
import { useAuth } from '@/hooks/useAuth';

interface AdaptiveSessionState {
  currentAtom: LearningAtom | null;
  isAdapting: boolean;
  adaptationReason: string | null;
  sessionStartTime: number;
  currentAttempt: number;
  initialDifficultySetFromHistory: boolean;
}

export const useAdaptiveLearningSession = (initialAtom: LearningAtom | null) => {
  const { user } = useAuth();
  
  const [sessionState, setSessionState] = useState<AdaptiveSessionState>({
    currentAtom: initialAtom,
    isAdapting: false,
    adaptationReason: null,
    sessionStartTime: Date.now(),
    currentAttempt: 0,
    initialDifficultySetFromHistory: false
  });

  const [responseStartTime, setResponseStartTime] = useState<number>(Date.now());

  // Initialize session when atom changes and set historically-informed difficulty
  useEffect(() => {
    const initializeAtomWithHistoricalDifficulty = async () => {
      if (initialAtom && user?.id && !sessionState.initialDifficultySetFromHistory) {
        console.log(`[useAdaptiveLearningSession] Initializing atom with historical difficulty: ${initialAtom.id}`);
        
        try {
          // Get historically-informed initial difficulty
          const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
            user.id,
            initialAtom.curriculumObjectiveId,
            initialAtom.subject
          );

          console.log(`[useAdaptiveLearningSession] Historical difficulty suggestion: ${suggestedDifficulty} for objective: ${initialAtom.curriculumObjectiveId}`);

          // Update atom with historically-informed difficulty if different
          let atomToUse = initialAtom;
          if (suggestedDifficulty !== initialAtom.difficulty) {
            atomToUse = {
              ...initialAtom,
              difficulty: suggestedDifficulty,
              id: `${initialAtom.id}-historical-${suggestedDifficulty}`,
              variantId: `historical-${suggestedDifficulty}`,
              content: {
                ...initialAtom.content,
                data: {
                  ...initialAtom.content.data,
                  historicalDifficultyAdjustment: {
                    originalDifficulty: initialAtom.difficulty,
                    adjustedTo: suggestedDifficulty,
                    reason: 'Based on historical performance'
                  }
                }
              }
            };
            console.log(`[useAdaptiveLearningSession] Adjusted difficulty from ${initialAtom.difficulty} to ${suggestedDifficulty}`);
          }

          // Start the adaptive session with the historically-informed atom
          InSessionAdaptiveManager.startAtomSession(atomToUse.id);
          
          setSessionState(prev => ({
            ...prev,
            currentAtom: atomToUse,
            sessionStartTime: Date.now(),
            currentAttempt: 0,
            initialDifficultySetFromHistory: true
          }));
          
        } catch (error) {
          console.error('[useAdaptiveLearningSession] Error getting historical difficulty:', error);
          // Fallback to original atom if historical lookup fails
          InSessionAdaptiveManager.startAtomSession(initialAtom.id);
          setSessionState(prev => ({
            ...prev,
            currentAtom: initialAtom,
            sessionStartTime: Date.now(),
            currentAttempt: 0,
            initialDifficultySetFromHistory: true
          }));
        }
        
        setResponseStartTime(Date.now());
      }
    };

    initializeAtomWithHistoricalDifficulty();
  }, [initialAtom?.id, user?.id, sessionState.initialDifficultySetFromHistory]);

  const recordResponse = useCallback((
    isCorrect: boolean,
    hintsUsed: number = 0
  ) => {
    if (!sessionState.currentAtom) return;

    const responseTime = (Date.now() - responseStartTime) / 1000;
    
    // Record the interaction with InSessionAdaptiveManager
    InSessionAdaptiveManager.recordAtomInteraction(
      sessionState.currentAtom.id,
      isCorrect,
      responseTime,
      hintsUsed
    );

    // Check if we should adapt the atom (real-time adaptation)
    const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(
      sessionState.currentAtom.id
    );

    if (adaptationCheck.shouldAdapt && adaptationCheck.newDifficulty && adaptationCheck.contentModifications) {
      console.log(`[useAdaptiveLearningSession] Real-time adaptation triggered: ${adaptationCheck.reason}`);
      
      setSessionState(prev => ({
        ...prev,
        isAdapting: true,
        adaptationReason: adaptationCheck.reason || null
      }));

      // Generate adapted variant using InSessionAdaptiveManager
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

    console.log(`[useAdaptiveLearningSession] Completing session for atom: ${sessionState.currentAtom.id}`);

    // Get final performance from InSessionAdaptiveManager
    const performance = InSessionAdaptiveManager.endAtomSession(sessionState.currentAtom.id);
    
    if (performance && user?.id) {
      // CRITICAL INTEGRATION: Record performance with UniverseSessionManager
      // This ensures real-time adaptive results are saved to historical tracking
      try {
        UniverseSessionManager.recordAtomPerformance(sessionState.currentAtom.id, performance);
        console.log(`[useAdaptiveLearningSession] Successfully recorded performance with UniverseSessionManager`);
      } catch (error) {
        console.error('[useAdaptiveLearningSession] Error recording performance with UniverseSessionManager:', error);
      }
    }
    
    setSessionState(prev => ({
      ...prev,
      currentAtom: null,
      isAdapting: false,
      adaptationReason: null,
      initialDifficultySetFromHistory: false
    }));

    return performance;
  }, [sessionState.currentAtom, user?.id]);

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
