
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import QuestionDisplay from "./QuestionDisplay";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import LessonHeader from "./LessonHeader";
import LessonControls from "./LessonControls";
import SessionTimer from "../SessionTimer";
import ConceptMasteryTracker from "./ConceptMasteryTracker";
import type { SessionData } from "./SessionProvider";

export interface SessionContentProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  onBack: () => void;
  learningObjective?: {
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  };
  sessionData: SessionData;
}

const SessionContent = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective,
  sessionData
}: SessionContentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    timeSpent,
    isGenerating,
    generationError,
    hasTriedFallback,
    generateNextQuestion,
    handleAnswerSelect,
    setCurrentQuestionIndex,
    currentQuestionIndex,
    currentQuestion,
    hasAnswered,
    answers,
    completeSession
  } = sessionData;

  const handleAnswerSelectWithMastery = (selectedAnswer: number) => {
    handleAnswerSelect(selectedAnswer);
    
    // Complete session if this was the last question
    if (currentQuestionIndex + 1 >= totalQuestions) {
      completeSession();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Generate next question if needed
      if (sessionData.sessionQuestions.length <= currentQuestionIndex + 1) {
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
          isSessionActive={true}
          onToggleSession={() => {}}
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

export default SessionContent;
