
import { useState, useCallback } from 'react';
import { generateFallbackQuestion } from '../utils/fallbackQuestions';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives?: string[];
  estimatedTime?: number;
  conceptsCovered?: string[];
}

export const useReliableQuestionGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = useCallback(async (params: {
    subject: string;
    skillArea: string;
    difficulty: number;
    excludeIds?: string[];
  }) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎯 ReliableQuestionGeneration: generateQuestion called');
      console.log('📋 Parameters:', params);
      
      // For now, we'll use the enhanced fallback generator
      // In production, this would attempt AI generation first, then fallback
      const fallbackQuestion = generateFallbackQuestion(
        params.subject, 
        params.skillArea, 
        params.difficulty
      );
      
      // Convert to the expected format
      const questionData = {
        id: fallbackQuestion.id,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: fallbackQuestion.question,
          options: fallbackQuestion.options,
          correctAnswer: fallbackQuestion.correct,
          explanation: fallbackQuestion.explanation
        }
      };
      
      console.log('✅ Generated enhanced fallback question:', questionData);
      return questionData;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Question generation failed:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const saveQuestionHistory = useCallback(async (
    question: any,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number
  ) => {
    console.log('📝 Saving question history (enhanced fallback)');
    // Enhanced implementation would save to database
    return true;
  }, []);

  return {
    generateQuestion,
    saveQuestionHistory,
    isGenerating,
    error
  };
};
