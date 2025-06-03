
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSessionManager, updateSessionProgress } from "./SessionManager";
import { useQuestionManager } from "./QuestionManager";
import { conceptMasteryService } from "../../../services/conceptMasteryService";

export interface SessionProviderProps {
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
  children: (sessionData: SessionData) => React.ReactNode;
}

export interface SessionData {
  sessionId: string | null;
  timeSpent: number;
  setTimeSpent: (time: number | ((prev: number) => number)) => void;
  sessionQuestions: any[];
  currentQuestionIndex: number;
  answers: number[];
  isGenerating: boolean;
  generationError: string | null;
  hasTriedFallback: boolean;
  generateNextQuestion: () => Promise<void>;
  handleAnswerSelect: (selectedAnswer: number) => void;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  resetQuestions: () => void;
  isSessionComplete: boolean;
  currentQuestion: any;
  hasAnswered: boolean;
  completeSession: () => Promise<void>;
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
  const [isSessionActive, setIsSessionActive] = useState(true);

  const { sessionId, timeSpent, setTimeSpent } = useSessionManager({
    subject,
    skillArea,
    difficultyLevel,
    onSessionReady: (id) => {
      console.log('Enhanced session ready:', id);
    }
  });

  const {
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generationError,
    hasTriedFallback,
    generateNextQuestion,
    handleAnswerSelect,
    setCurrentQuestionIndex,
    resetQuestions
  } = useQuestionManager({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || '',
    totalQuestions
  });

  // Auto-generate first question when session is ready
  useEffect(() => {
    if (sessionId && sessionQuestions.length === 0 && !isGenerating) {
      console.log('🎬 Auto-generating first question for enhanced session...');
      generateNextQuestion();
    }
  }, [sessionId, sessionQuestions.length, isGenerating, generateNextQuestion]);

  const isSessionComplete = currentQuestionIndex >= totalQuestions;
  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const hasAnswered = answers.length > currentQuestionIndex;

  const completeSession = async () => {
    if (!sessionId || !user?.id) return;

    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === sessionQuestions[index]?.correct ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    await updateSessionProgress(sessionId, timeSpent, score);

    // Update concept mastery for each question
    for (let i = 0; i < sessionQuestions.length; i++) {
      const question = sessionQuestions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correct;
      
      // Extract concept name from question or use skill area
      const conceptName = learningObjective?.title || skillArea;
      
      await conceptMasteryService.updateConceptMastery(
        user.id,
        conceptName,
        subject,
        isCorrect
      );
    }
  };

  const sessionData: SessionData = {
    sessionId,
    timeSpent,
    setTimeSpent,
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generationError,
    hasTriedFallback,
    generateNextQuestion,
    handleAnswerSelect,
    setCurrentQuestionIndex,
    resetQuestions,
    isSessionComplete,
    currentQuestion,
    hasAnswered,
    completeSession
  };

  return <>{children(sessionData)}</>;
};

export default SessionProvider;
