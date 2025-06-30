
import { useState } from 'react';
import type { LearnerProfile } from '@/types/learnerProfile';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';

export interface AdaptivePracticeState {
  learnerProfile: LearnerProfile | null;
  currentKc: KnowledgeComponent | null;
  atomSequence: any | null;
  currentAtomIndex: number;
  sessionKcs: KnowledgeComponent[];
  isLoading: boolean;
  error: string | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  feedbackMessage: string;
}

const initialState: AdaptivePracticeState = {
  learnerProfile: null,
  currentKc: null,
  atomSequence: null,
  currentAtomIndex: 0,
  sessionKcs: [],
  isLoading: true,
  error: null,
  showFeedback: false,
  isCorrect: null,
  feedbackMessage: ''
};

export const useAdaptivePracticeState = () => {
  const [state, setState] = useState<AdaptivePracticeState>(initialState);

  const updateState = (updates: Partial<AdaptivePracticeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetFeedback = () => {
    setState(prev => ({
      ...prev,
      showFeedback: false,
      isCorrect: null,
      feedbackMessage: ''
    }));
  };

  const setError = (error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  return {
    state,
    updateState,
    resetFeedback,
    setError,
    setLoading
  };
};
