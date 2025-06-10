import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDiverseQuestionGeneration, Question } from '../hooks/useDiverseQuestionGeneration';
import { useStudentProgressTracker } from '../hooks/useStudentProgressTracker';

export interface SessionTimers {
  sessionStartTime: number;
  questionStartTime: number;
  timeLeft: number;
  isTimerRunning: boolean;
}

export interface SessionAnswer {
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
  responseTime: number;
}

export interface UnifiedSessionState {
  // Core session data
  sessionId: string;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  currentQuestion: Question | null;
  questions: Question[];
  answers: SessionAnswer[];
  
  // Answer and display state
  selectedAnswer: number | null;
  hasAnswered: boolean;
  showResult: boolean;
  
  // Session progress
  currentQuestionIndex: number;
  questionNumber: number;
  correctAnswers: number;
  totalQuestions: number;
  
  // Loading and error states
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  
  // Timers
  timers: SessionTimers;
  
  // Session completion
  isSessionComplete: boolean;
  
  // Actions
  handleAnswerSelect: (answerIndex: number) => Promise<void>;
  generateNextQuestion: () => Promise<void>;
  startTimer: (time?: number) => void;
  stopTimer: () => void;
  resetSession: () => void;
}

interface UnifiedSessionContextProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  timerDuration?: number;
  onSessionComplete?: () => void;
  children: ReactNode;
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
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  timerDuration = 30,
  onSessionComplete,
  children
}: UnifiedSessionContextProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Core session state
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Timer state
  const [sessionStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks
  const { generateDiverseQuestion, saveQuestionHistory, isGenerating } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || '',
    gradeLevel: 6,
    standardsAlignment: null
  });

  const { updateProgress } = useStudentProgressTracker(subject, skillArea);
  
  // Computed values
  const currentQuestion = questions[currentQuestionIndex] || null;
  const questionNumber = currentQuestionIndex + 1;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const isSessionComplete = answers.length >= totalQuestions;
  
  // Timer functions
  const startTimer = useCallback((time = timerDuration) => {
    setTimeLeft(time);
    setIsTimerRunning(true);
    setQuestionStartTime(Date.now());
  }, [timerDuration]);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      // Auto-select first answer if time runs out
      if (!hasAnswered && currentQuestion) {
        handleAnswerSelect(0);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerRunning, hasAnswered, currentQuestion]);

  const generateNextQuestion = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const question = await generateDiverseQuestion();
      setQuestions(prev => [...prev, question]);
      
      // Reset question state
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResult(false);
      startTimer();
      
      console.log('✅ Generated question:', question.question);
    } catch (error) {
      console.error('Failed to generate question:', error);
      setError('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, generateDiverseQuestion, startTimer]);

  const handleAnswerSelect = useCallback(async (answerIndex: number) => {
    if (hasAnswered || !currentQuestion) return;
    
    // Clear any existing auto-advance timer
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    setShowResult(true);
    stopTimer();
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const responseTime = Date.now() - questionStartTime;
    
    const answerData: SessionAnswer = {
      question: currentQuestion,
      selectedAnswer: answerIndex,
      isCorrect,
      responseTime
    };
    
    // Save to history
    if (user?.id) {
      await saveQuestionHistory(currentQuestion, answerIndex, isCorrect, responseTime);
    }
    
    // Show toast
    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect",
      description: isCorrect ? "Well done!" : currentQuestion.explanation,
      duration: 2000,
      variant: isCorrect ? "default" : "destructive"
    });
    
    // Update answers state and handle auto-advance
    setAnswers(prev => {
      const newAnswers = [...prev, answerData];
      
      // Schedule auto-advance after state update
      autoAdvanceRef.current = setTimeout(async () => {
        if (newAnswers.length >= totalQuestions) {
          // Session complete
          const sessionDuration = Date.now() - sessionStartTime;
          const finalCorrectAnswers = newAnswers.filter(a => a.isCorrect).length;
          
          await updateProgress({
            questionsAnswered: totalQuestions,
            correctAnswers: finalCorrectAnswers,
            conceptsWorkedOn: [skillArea],
            timeSpent: sessionDuration
          });
          
          toast({
            title: "Session Complete! 🎓",
            description: `You got ${finalCorrectAnswers}/${totalQuestions} questions correct!`,
            duration: 5000
          });
          
          onSessionComplete?.();
        } else {
          // Next question
          setCurrentQuestionIndex(prev => prev + 1);
          // Generate next question will be triggered by useEffect when currentQuestionIndex changes
        }
      }, 3000);
      
      return newAnswers;
    });
  }, [
    hasAnswered,
    currentQuestion,
    stopTimer,
    questionStartTime,
    user?.id,
    saveQuestionHistory,
    toast,
    totalQuestions,
    sessionStartTime,
    updateProgress,
    skillArea,
    onSessionComplete
  ]);

  const resetSession = useCallback(() => {
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResult(false);
    setError(null);
    stopTimer();
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
  }, [stopTimer]);

  // Initialize first question
  useEffect(() => {
    if (user?.id && questions.length === 0 && !isLoading && !isGenerating) {
      generateNextQuestion();
    }
  }, [user?.id, questions.length, isLoading, isGenerating, generateNextQuestion]);

  // Generate next question when index advances
  useEffect(() => {
    if (currentQuestionIndex > 0 && currentQuestionIndex >= questions.length && !isLoading && !isGenerating) {
      generateNextQuestion();
    }
  }, [currentQuestionIndex, questions.length, isLoading, isGenerating, generateNextQuestion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  const sessionState: UnifiedSessionState = {
    sessionId,
    subject,
    skillArea,
    difficultyLevel,
    currentQuestion,
    questions,
    answers,
    selectedAnswer,
    hasAnswered,
    showResult,
    currentQuestionIndex,
    questionNumber,
    correctAnswers,
    totalQuestions,
    isLoading: isLoading || isGenerating,
    isGenerating,
    error,
    timers: {
      sessionStartTime,
      questionStartTime,
      timeLeft,
      isTimerRunning
    },
    isSessionComplete,
    handleAnswerSelect,
    generateNextQuestion,
    startTimer,
    stopTimer,
    resetSession
  };

  return (
    <UnifiedSessionContext.Provider value={sessionState}>
      {children}
    </UnifiedSessionContext.Provider>
  );
};