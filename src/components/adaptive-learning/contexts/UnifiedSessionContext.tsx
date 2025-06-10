
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
  
  // Actions
  handleAnswerSelect: (answerIndex: number) => void;
  handleSubmitAnswer: () => void;
  handleNextQuestion: () => void;
  handleSessionComplete: () => void;
  handleRetry: () => void;
}

interface UnifiedSessionContextProps {
  children: ReactNode;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onSessionReady?: (data: any) => void;
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
  onSessionReady
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex] || null;
  const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

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

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!hasAnswered) {
      setSelectedAnswer(answerIndex);
    }
  }, [hasAnswered]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer !== null && !hasAnswered) {
      setHasAnswered(true);
      setShowResult(true);
      setQuestionsAnswered(prev => prev + 1);
      
      if (currentQuestion && selectedAnswer === currentQuestion.correct) {
        setCorrectAnswers(prev => prev + 1);
      }
    }
  }, [selectedAnswer, hasAnswered, currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setHasAnswered(false);
    } else {
      handleSessionComplete();
    }
  }, [currentQuestionIndex, questions.length]);

  const handleSessionComplete = useCallback(() => {
    setIsComplete(true);
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
    setTimeSpent(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setIsComplete(false);
    setIsActive(true);
  }, []);

  // Initialize session
  useEffect(() => {
    if (!isActive && questions.length === 0) {
      // Mock questions for demo
      const mockQuestions = [
        {
          id: '1',
          question: 'Sample question 1',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: 'This is the explanation for question 1'
        },
        {
          id: '2',
          question: 'Sample question 2',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 1,
          explanation: 'This is the explanation for question 2'
        }
      ];
      
      setQuestions(mockQuestions);
      setIsActive(true);
      
      if (onSessionReady) {
        onSessionReady({ questions: mockQuestions, sessionId });
      }
    }
  }, [isActive, questions.length, sessionId, onSessionReady]);

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
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handleSessionComplete,
    handleRetry
  };

  return (
    <UnifiedSessionContext.Provider value={sessionState}>
      {children}
    </UnifiedSessionContext.Provider>
  );
};
