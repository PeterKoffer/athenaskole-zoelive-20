
// Unified Question Generation Hook

import { useState, useCallback } from 'react';
import { unifiedQuestionGenerationService } from '@/services/unifiedQuestionGeneration';
import { QuestionMetadata } from '@/services/globalQuestionUniquenessService';

export const useUnifiedQuestionGeneration = (userId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async (metadata: QuestionMetadata) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const question = await unifiedQuestionGenerationService.generateQuestion(userId, metadata);
      return question;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  const generateBatchQuestions = useCallback(async (count: number, metadata: QuestionMetadata) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const questions = await unifiedQuestionGenerationService.generateBatchQuestions(userId, count, metadata);
      return questions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  return {
    generateQuestion,
    generateBatchQuestions,
    isGenerating,
    error
  };
};
