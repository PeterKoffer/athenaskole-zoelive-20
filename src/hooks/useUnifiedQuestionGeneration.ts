
// Unified Question Generation Hook

import { useState, useCallback } from 'react';
import { UnifiedQuestionGenerationService } from '@/services/unifiedQuestionGeneration';


export const useUnifiedQuestionGeneration = (userId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const question = await UnifiedQuestionGenerationService.generateQuestion();
      return question;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  return {
    generateQuestion,
    generateUniqueQuestion: generateQuestion,
    saveQuestionHistory: async () => {},
    generationStats: { total: 0, unique: 0 },
    isGenerating,
    error
  };
};
