
// DEPRECATED: This file has been replaced by UnifiedSessionContext.tsx
// The functionality of this component has been consolidated into the unified session state management
// Please use UnifiedSessionProvider instead

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiverseQuestionGeneration, Question } from '../hooks/useDiverseQuestionGeneration';
import { useToast } from '@/hooks/use-toast';

export interface SessionData {
  sessionId: string | null;
  currentQuestion: Question | null;
  questions: Question[];
  answers: Array<{
    question: Question;
    selectedAnswer: number;
    isCorrect: boolean;
    responseTime: number;
  }>;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  hasAnswered: boolean;
  showResult: boolean;
  isLoading: boolean;
  error: string | null;
  isSessionComplete: boolean;
  timeSpent: number;
  handleAnswerSelect: (answerIndex: number) => void;
  generateNextQuestion: () => Promise<void>;
}

const SessionContext = createContext<SessionData | null>(null);

interface SessionProviderProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
  children: (sessionData: SessionData) => ReactNode;
}

const SessionProvider = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  learningObjective,
  children
}: SessionProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Array<{
    question: Question;
    selectedAnswer: number;
    isCorrect: boolean;
    responseTime: number;
  }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const { generateDiverseQuestion, saveQuestionHistory, isGenerating } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || '',
    gradeLevel: 6,
    standardsAlignment: null
  });

  const currentQuestion = questions[currentQuestionIndex] || null;
  const isSessionComplete = answers.length >= totalQuestions;
  const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

  const generateNextQuestion = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setQuestionStartTime(Date.now());
      
      const question = await generateDiverseQuestion();
      setQuestions(prev => [...prev, question]);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResult(false);
      
      console.log('✅ Generated question:', question.question);
    } catch (error) {
      console.error('Failed to generate question:', error);
      setError('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, generateDiverseQuestion]);

  const handleAnswerSelect = useCallback(async (answerIndex: number) => {
    if (hasAnswered || !currentQuestion || selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correct;
    const responseTime = Date.now() - questionStartTime;

    const answerData = {
      question: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect,
      responseTime
    };

    setAnswers(prev => [...prev, answerData]);

    // Save to history
    if (user?.id) {
      await saveQuestionHistory(
        currentQuestion,
        answerIndex,
        isCorrect,
        responseTime
      );
    }

    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect",
      description: isCorrect ? "Well done!" : currentQuestion.explanation,
      duration: 2000,
      variant: isCorrect ? "default" : "destructive"
    });

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (answers.length + 1 < totalQuestions) {
        setCurrentQuestionIndex(prev => prev + 1);
        generateNextQuestion();
      }
    }, 3000);
  }, [hasAnswered, currentQuestion, selectedAnswer, questionStartTime, user?.id, saveQuestionHistory, toast, answers.length, totalQuestions, generateNextQuestion]);

  const sessionData: SessionData = {
    sessionId,
    currentQuestion,
    questions,
    answers,
    currentQuestionIndex,
    selectedAnswer,
    hasAnswered,
    showResult,
    isLoading: isLoading || isGenerating,
    error,
    isSessionComplete,
    timeSpent,
    handleAnswerSelect,
    generateNextQuestion
  };

  return (
    <SessionContext.Provider value={sessionData}>
      {children(sessionData)}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
