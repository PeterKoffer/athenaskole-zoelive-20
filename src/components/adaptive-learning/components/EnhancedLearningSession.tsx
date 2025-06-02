
import { useState, useEffect } from "react";
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
import ConceptMasteryTracker from "./ConceptMasteryTracker";
import { useSessionManager, updateSessionProgress } from "./SessionManager";
import { useQuestionManager } from "./QuestionManager";
import { conceptMasteryService } from "../../../services/conceptMasteryService";

export interface EnhancedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
}

const EnhancedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack,
  learningObjective 
}: EnhancedLearningSessionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [showConceptTracker, setShowConceptTracker] = useState(false);

  const totalQuestions = 5;

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

  const handleAnswerSelectWithMastery = (selectedAnswer: number) => {
    handleAnswerSelect(selectedAnswer, completeSession);
  };

  const handleRetry = () => {
    resetQuestions();
    setTimeSpent(0);
    setShowConceptTracker(false);
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
      <div className="max-w-4xl mx-auto space-y-6">
        <LessonComplete
          score={Math.round((correctAnswers / totalQuestions) * 100)}
          totalQuestions={totalQuestions}
          onRetry={handleRetry}
          onBack={onBack}
        />
        
        {/* Show concept mastery tracking after completion */}
        <ConceptMasteryTracker 
          subject={subject} 
          skillArea={skillArea}
        />
      </div>
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
    <div className="max-w-4xl mx-auto space-y-6">
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
          learningObjective={learningObjective}
        />

        <div className="p-6">
          {isGenerating || !currentQuestion ? (
            <LoadingState subject={subject} skillArea={skillArea} />
          ) : (
            <QuestionDisplay
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelectWithMastery}
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

      {/* Concept Mastery Tracker - show alongside session */}
      {user && (
        <ConceptMasteryTracker 
          subject={subject} 
          skillArea={skillArea}
        />
      )}
    </div>
  );
};

export default EnhancedLearningSession;
