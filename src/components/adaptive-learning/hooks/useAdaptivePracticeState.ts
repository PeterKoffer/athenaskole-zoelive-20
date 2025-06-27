
import { useState, useCallback } from 'react';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import { AtomSequence, ContentAtom } from '@/types/content';

export interface AdaptivePracticeState {
  learnerProfile: LearnerProfile | null;
  currentKc: KnowledgeComponent | null;
  atomSequence: AtomSequence | null;
  currentAtomIndex: number;
  isLoading: boolean;
  error: string | null;
  sessionKcs: KnowledgeComponent[];
  showFeedback: boolean;
  isCorrect: boolean;
  feedbackMessage: string;
  showServiceTests: boolean;
}

export const useAdaptivePracticeState = () => {
  const [state, setState] = useState<AdaptivePracticeState>({
    learnerProfile: null,
    currentKc: null,
    atomSequence: null,
    currentAtomIndex: 0,
    isLoading: true,
    error: null,
    sessionKcs: [],
    showFeedback: false,
    isCorrect: false,
    feedbackMessage: "",
    showServiceTests: false,
  });

  const updateState = useCallback((updates: Partial<AdaptivePracticeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFeedback = useCallback(() => {
    updateState({ showFeedback: false, isCorrect: false, feedbackMessage: "" });
  }, [updateState]);

  const setError = useCallback((error: string | null) => {
    console.error('🚨 AdaptivePractice Error:', error);
    updateState({ error, isLoading: false });
  }, [updateState]);

  const setLoading = useCallback((isLoading: boolean) => {
    updateState({ isLoading });
  }, [updateState]);

  return {
    state,
    updateState,
    resetFeedback,
    setError,
    setLoading
  };
};
