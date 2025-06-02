
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import QuestionDisplay from "./components/QuestionDisplay";
import LessonComplete from "./components/LessonComplete";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import LessonHeader from "./components/LessonHeader";
import LessonControls from "./components/LessonControls";
import SessionTimer from "./SessionTimer";
import { useQuestionGeneration, Question } from "./hooks/useQuestionGeneration";
import { progressPersistence } from "@/services/progressPersistence";
import { createFallbackQuestion } from "./utils/fallbackQuestions";

export interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, difficultyLevel, onBack }: AILearningModuleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  const totalQuestions = 5;
  const isSessionComplete = currentQuestionIndex >= totalQuestions;
  
  const { 
    generateQuestion, 
    isGenerating, 
    error: generationError 
  } = useQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId: user?.id || ''
  });

  // Initialize session
  useEffect(() => {
    if (user?.id && !sessionId) {
      initializeSession();
    }
  }, [user?.id]);

  // Generate first question when session starts
  useEffect(() => {
    if (sessionId && sessionQuestions.length === 0) {
      generateNextQuestion();
    }
  }, [sessionId]);

  const initializeSession = async () => {
    if (!user?.id) return;

    const newSessionId = await progressPersistence.saveSession({
      user_id: user.id,
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel,
      start_time: new Date().toISOString(),
      time_spent: 0,
      score: 0,
      completed: false
    });

    if (newSessionId) {
      setSessionId(newSessionId);
      console.log('Session initialized:', newSessionId);
    }
  };

  const generateNextQuestion = async () => {
    if (sessionQuestions.length >= totalQuestions) {
      return;
    }

    console.log('🎯 Generating next question...');
    const usedQuestions = sessionQuestions.map(q => q.question);
    
    try {
      const newQuestion = await generateQuestion(usedQuestions);
      
      if (newQuestion) {
        console.log('✅ AI question generated successfully');
        setSessionQuestions(prev => [...prev, newQuestion]);
        setHasTriedFallback(false);
      } else {
        throw new Error('AI generation returned null');
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      
      if (!hasTriedFallback) {
        console.log('🔄 Using fallback question...');
        const fallbackQuestion = createFallbackQuestion();
        setSessionQuestions(prev => [...prev, fallbackQuestion]);
        setHasTriedFallback(true);
        
        toast({
          title: "Using Backup Question",
          description: "AI generation failed, using a backup question",
          duration: 3000
        });
      } else {
        toast({
          title: "Error",
          description: "Could not generate question. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnswerSelect = async (selectedAnswer: number) => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correct;
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Generate next question if needed
      if (nextIndex < totalQuestions && sessionQuestions.length <= nextIndex) {
        generateNextQuestion();
      }
      
      // Complete session if this was the last question
      if (nextIndex >= totalQuestions) {
        completeSession(newAnswers);
      }
    }, 1500);

    // Show feedback toast
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Well done!" : "Try again next time",
      variant: isCorrect ? "default" : "destructive"
    });
  };

  const completeSession = async (finalAnswers: number[]) => {
    if (!sessionId || !user?.id) return;

    const correctAnswers = finalAnswers.reduce((count, answer, index) => {
      return count + (answer === sessionQuestions[index]?.correct ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Update session in database
    await progressPersistence.updateSession(sessionId, {
      end_time: new Date().toISOString(),
      time_spent: timeSpent,
      score,
      completed: true
    });

    console.log('Session completed:', {
      score,
      correctAnswers,
      totalQuestions,
      timeSpent
    });
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSessionQuestions([]);
    setAnswers([]);
    setTimeSpent(0);
    setSessionId(null);
    setHasTriedFallback(false);
    initializeSession();
  };

  const handleToggleSession = () => {
    setIsSessionActive(!isSessionActive);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Generate next question if needed
      if (sessionQuestions.length <= currentQuestionIndex + 1) {
        generateNextQuestion();
      }
    }
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Moving to next question",
      duration: 2000
    });
    handleNextQuestion();
  };

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const hasAnswered = answers.length > currentQuestionIndex;

  if (isSessionComplete) {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === sessionQuestions[index]?.correct ? 1 : 0);
    }, 0);

    return (
      <LessonComplete
        score={Math.round((correctAnswers / totalQuestions) * 100)}
        totalQuestions={totalQuestions}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  if (generationError && !hasTriedFallback) {
    return (
      <ErrorState
        onRetry={() => {
          setHasTriedFallback(false);
          generateNextQuestion();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SessionTimer
        onTimeUp={handleTimeUp}
        recommendedDuration={20}
      />
      
      <Card className="bg-gray-900 border-gray-800 overflow-hidden">
        <LessonHeader
          subject={subject}
          skillArea={skillArea}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          difficultyLevel={difficultyLevel}
          timeSpent={timeSpent}
          onBack={onBack}
        />

        <div className="p-6">
          {isGenerating || !currentQuestion ? (
            <LoadingState />
          ) : (
            <QuestionDisplay
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelect}
              hasAnswered={hasAnswered}
              selectedAnswer={hasAnswered ? answers[currentQuestionIndex] : undefined}
              autoSubmit={true}
            />
          )}
        </div>

        <LessonControls
          isSessionActive={isSessionActive}
          onToggleSession={handleToggleSession}
          onNextQuestion={handleNextQuestion}
          canSkip={!hasAnswered && !!currentQuestion}
        />
      </Card>
    </div>
  );
};

export default AILearningModule;
