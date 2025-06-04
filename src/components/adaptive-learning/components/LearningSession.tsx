
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import QuestionDisplay from "./QuestionDisplay";
import LessonComplete from "./LessonComplete";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import LessonHeader from "./LessonHeader";
import LessonControls from "./LessonControls";
import SessionTimer from "../SessionTimer";
import { useSessionManager, updateSessionProgress } from "./SessionManager";
import { useQuestionManager } from "./QuestionManager";

export interface LearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const LearningSession = ({ subject, skillArea, difficultyLevel, onBack }: LearningSessionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(true);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalQuestions = 5;

  const { sessionId, timeSpent, setTimeSpent } = useSessionManager({
    subject,
    skillArea,
    difficultyLevel,
    onSessionReady: (id) => {
      console.log('Session ready:', id);
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
      console.log('🎬 Auto-generating first question...');
      generateNextQuestion();
    }
  }, [sessionId, sessionQuestions.length, isGenerating, generateNextQuestion]);

  // Auto-scroll to question card when a new question loads
  useEffect(() => {
    if (sessionQuestions[currentQuestionIndex] && questionCardRef.current) {
      setTimeout(() => {
        questionCardRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [sessionQuestions, currentQuestionIndex]);

  // Auto-scroll to top when starting new session
  useEffect(() => {
    if (containerRef.current && sessionQuestions.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [sessionQuestions.length]);

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
  };

  const handleAnswerSelectWithComplete = (selectedAnswer: number) => {
    handleAnswerSelect(selectedAnswer, completeSession);
  };

  const handleRetry = () => {
    resetQuestions();
    setTimeSpent(0);
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
          generateNextQuestion();
        }}
      />
    );
  }

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto">
      <SessionTimer
        onTimeUp={handleTimeUp}
        recommendedDuration={20}
      />
      
      <Card ref={questionCardRef} className="bg-gray-900 border-gray-800 overflow-hidden">
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
            <LoadingState subject={subject} skillArea={skillArea} />
          ) : (
            <QuestionDisplay
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelectWithComplete}
              hasAnswered={hasAnswered}
              selectedAnswer={hasAnswered ? answers[currentQuestionIndex] : undefined}
              autoSubmit={true}
              subject={subject}
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

export default LearningSession;
