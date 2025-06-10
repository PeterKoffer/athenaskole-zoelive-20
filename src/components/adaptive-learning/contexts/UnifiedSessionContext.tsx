
import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';

export interface UnifiedSessionState {
  // Session management
  sessionId: string;
  isActive: boolean;
  isComplete: boolean;
  
  // Question management
  currentQuestionIndex: number;
  questions: any[];
  currentQuestion: any;
  selectedAnswer: number | null;
  showResult: boolean;
  hasAnswered: boolean;
  
  // Progress tracking
  timeSpent: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  
  // Enhanced session properties for compatibility
  subject: string;
  skillArea: string;
  totalQuestions: number;
  isSessionComplete: boolean;
  answers: Array<{ isCorrect: boolean; userAnswer: number; questionId?: string }>;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  questionNumber: number;
  
  // Timer management
  timers: {
    sessionStartTime: number;
    questionStartTime: number;
  };
  
  // Actions
  handleAnswerSelect: (answerIndex: number) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handleSessionComplete: () => void;
  handleRetry: () => void;
  generateNextQuestion: () => Promise<void>;
}

interface UnifiedSessionContextProps {
  children: ReactNode;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  onSessionReady?: (data: any) => void;
  onSessionComplete?: () => void;
}

const UnifiedSessionContext = createContext<UnifiedSessionState | null>(null);

export const useUnifiedSession = () => {
  const context = useContext(UnifiedSessionContext);
  if (!context) {
    throw new Error('useUnifiedSession must be used within UnifiedSessionProvider');
  }
  return context;
};

export const UnifiedSessionProvider = ({
  children,
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onSessionReady,
  onSessionComplete
}: UnifiedSessionContextProps) => {
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState<Array<{ isCorrect: boolean; userAnswer: number; questionId?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef(Date.now());
  const questionStartTime = useRef(Date.now());

  const currentQuestion = questions[currentQuestionIndex] || null;
  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
  const isSessionComplete = questionsAnswered >= totalQuestions;
  const questionNumber = currentQuestionIndex + 1;

  const timers = {
    sessionStartTime: sessionStartTime.current,
    questionStartTime: questionStartTime.current
  };

  // Timer management
  useEffect(() => {
    if (isActive && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isComplete]);

  const generateNextQuestion = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Mock question generation for demo
      const newQuestion = {
        id: `q-${Date.now()}`,
        question: `Sample ${subject} question ${questionNumber}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4),
        explanation: `This is the explanation for ${subject} question ${questionNumber}`
      };
      
      setQuestions(prev => [...prev, newQuestion]);
      questionStartTime.current = Date.now();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate question');
    } finally {
      setIsGenerating(false);
    }
  }, [subject, questionNumber]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!hasAnswered) {
      setSelectedAnswer(answerIndex);
    }
  }, [hasAnswered]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer !== null && !hasAnswered && currentQuestion) {
      setHasAnswered(true);
      setShowResult(true);
      setQuestionsAnswered(prev => prev + 1);
      
      const isCorrect = selectedAnswer === currentQuestion.correct;
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
      
      // Store answer
      setAnswers(prev => [...prev, {
        isCorrect,
        userAnswer: selectedAnswer,
        questionId: currentQuestion.id
      }]);
    }
  }, [selectedAnswer, hasAnswered, currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHasAnswered(false);
      questionStartTime.current = Date.now();
    } else if (questionsAnswered < totalQuestions) {
      generateNextQuestion();
      setSelectedAnswer(null);
      setShowResult(false);
      setHasAnswered(false);
    } else {
      handleSessionComplete();
    }
  }, [currentQuestionIndex, questions.length, questionsAnswered, totalQuestions, generateNextQuestion]);

  const handleSessionComplete = useCallback(() => {
    setIsComplete(true);
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (onSessionComplete) {
      onSessionComplete();
    }
  }, [onSessionComplete]);

  const handleRetry = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
    setTimeSpent(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setAnswers([]);
    setIsComplete(false);
    setIsActive(true);
    setError(null);
    sessionStartTime.current = Date.now();
    questionStartTime.current = Date.now();
  }, []);

  // Initialize session
  useEffect(() => {
    if (!isActive && questions.length === 0) {
      // Mock questions for demo
      const mockQuestions = [
        {
          id: '1',
          question: `Sample ${subject} question 1`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: `This is the explanation for ${subject} question 1`
        },
        {
          id: '2',
          question: `Sample ${subject} question 2`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 1,
          explanation: `This is the explanation for ${subject} question 2`
        }
      ];
      
      setQuestions(mockQuestions);
      setIsActive(true);
      
      if (onSessionReady) {
        onSessionReady({ questions: mockQuestions, sessionId });
      }
    }
  }, [isActive, questions.length, sessionId, onSessionReady, subject]);

  const sessionState: UnifiedSessionState = {
    sessionId,
    isActive,
    isComplete,
    currentQuestionIndex,
    questions,
    currentQuestion,
    selectedAnswer,
    showResult,
    hasAnswered,
    timeSpent,
    questionsAnswered,
    correctAnswers,
    accuracy,
    subject,
    skillArea,
    totalQuestions,
    isSessionComplete,
    answers,
    isLoading,
    isGenerating,
    error,
    questionNumber,
    timers,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handleSessionComplete,
    handleRetry,
    generateNextQuestion
  };

  return (
    <UnifiedSessionContext.Provider value={sessionState}>
      {children}
    </UnifiedSessionContext.Provider>
  );
};
