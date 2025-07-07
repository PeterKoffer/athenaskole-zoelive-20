
// Complete implementation for Adaptive Practice Logic Hook

import { useState, useCallback } from 'react';
import { contentOrchestrator } from '@/services/content/ContentOrchestrator';

interface AdaptivePracticeState {
  isLoading: boolean;
  error: string | null;
  learnerProfile: any | null;
  currentKc: any | null;
  atomSequence: any | null;
  currentAtomIndex: number;
}

export const useAdaptivePracticeLogic = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<AdaptivePracticeState>({
    isLoading: true,
    error: null,
    learnerProfile: null,
    currentKc: null,
    atomSequence: null,
    currentAtomIndex: 0
  });

  const generateAdaptiveContent = useCallback(async (
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    userId: string
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎯 Adaptive Practice Logic: generateAdaptiveContent');
      
      const result = await contentOrchestrator.orchestrateContent(
        subject,
        skillArea,
        difficultyLevel
      );
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const getOptimalPath = useCallback(async (userId: string, subject: string) => {
    try {
      console.log('🛤️ Adaptive Practice Logic: getOptimalPath');
      
      const result = await contentOrchestrator.getOptimalContent(userId, subject, 'general');
      return result;
    } catch (err) {
      console.error('Error getting optimal path:', err);
      return null;
    }
  }, []);

  const getAtomSequenceForKc = useCallback(async (kcId: string, userId: string) => {
    try {
      console.log('🔄 Adaptive Practice Logic: getAtomSequenceForKc');
      
      const result = await contentOrchestrator.getAtomSequenceForKc(kcId, userId);
      return result;
    } catch (err) {
      console.error('Error getting atom sequence:', err);
      return null;
    }
  }, []);

  const handleNextAtom = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentAtomIndex: prev.currentAtomIndex + 1
    }));
  }, []);

  const handleQuestionAnswer = useCallback((atom: any, userAnswer: string, isCorrect: boolean) => {
    console.log('📝 Question answered:', { atom: atom.atom_id, userAnswer, isCorrect });
    // Handle question answer logic here
  }, []);

  const handleRetry = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, []);

  return {
    generateAdaptiveContent,
    getOptimalPath,
    getAtomSequenceForKc,
    handleNextAtom,
    handleQuestionAnswer,
    handleRetry,
    state,
    isGenerating,
    error
  };
};
