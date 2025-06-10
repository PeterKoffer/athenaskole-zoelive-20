
// DEPRECATED: This file has been replaced by UnifiedSessionContext.tsx
// The functionality of this hook has been consolidated into the unified session state management
// Please use UnifiedSessionProvider and useUnifiedSession instead

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionMetrics } from '@/hooks/useSessionMetrics';
import { useDiverseQuestionGeneration, Question } from './useDiverseQuestionGeneration';

interface UseSessionStateProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
}

export const useSessionState = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions
}: UseSessionStateProps) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  const {
    questionsCompleted,
    correctAnswers,
    totalResponseTime,
    resetMetrics,
    updateMetrics
  } = useSessionMetrics();

  const { generateDiverseQuestion, saveQuestionHistory, isGenerating } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || '',
    gradeLevel: 6,
    standardsAlignment: null
  });

  const generateNextQuestion = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const newQuestion = await generateDiverseQuestion();
      setCurrentQuestion(newQuestion);
      setQuestions(prev => [...prev, newQuestion]);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResult(false);
    } catch (error) {
      console.error('Failed to generate question:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, generateDiverseQuestion]);

  const handleAnswerSelect = useCallback(async (selectedIndex: number) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(selectedIndex);
    setHasAnswered(true);
    setShowResult(true);

    const isCorrect = selectedIndex === currentQuestion.correct;
    updateMetrics(isCorrect, 30);

    // Save to history
    if (user?.id) {
      await saveQuestionHistory(
        currentQuestion,
        selectedIndex,
        isCorrect,
        30000
      );
    }

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        generateNextQuestion();
      }
    }, 3000);
  }, [hasAnswered, currentQuestion, updateMetrics, user?.id, saveQuestionHistory, currentQuestionIndex, totalQuestions, generateNextQuestion]);

  useEffect(() => {
    if (user?.id && !hasInitialized.current) {
      hasInitialized.current = true;
      generateNextQuestion();
    }
  }, [user?.id, generateNextQuestion]);

  return {
    currentQuestion,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    hasAnswered,
    showResult,
    isLoading: isLoading || isGenerating,
    questionsCompleted,
    correctAnswers,
    totalResponseTime,
    generateNextQuestion,
    handleAnswerSelect,
    resetMetrics
  };
};
