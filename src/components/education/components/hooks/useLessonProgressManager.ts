
// Lesson Progress Manager Hook

import { useState, useCallback } from 'react';
import { subjectQuestionService } from '@/services/subjectQuestionService';

export const useLessonProgressManager = (subject: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNextQuestion = useCallback(async (difficulty: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the correct method names from subjectQuestionService
      const question = await subjectQuestionService.createDynamicQuestion(subject, difficulty);
      return question;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subject]);

  const getRandomQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const question = await subjectQuestionService.getRandomQuestionForSubject(subject);
      return question;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [subject]);

  return {
    getNextQuestion,
    getRandomQuestion,
    isLoading,
    error
  };
};
