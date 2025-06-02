
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
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { progressPersistence } from "@/services/progressPersistence";

interface GeneratedContent {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime?: number;
}

interface AILearningModuleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule = ({ subject, skillArea, difficultyLevel, onBack }: AILearningModuleProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<GeneratedContent[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const totalQuestions = 5; // Fixed number of questions per session
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

    const usedQuestions = sessionQuestions.map(q => q.question);
    const newQuestion = await generateQuestion(usedQuestions);
    
    if (newQuestion) {
      setSessionQuestions(prev => [...prev, newQuestion]);
    } else {
      toast({
        title: "Fejl",
        description: "Kunne ikke generere spørgsmål. Prøv igen.",
        variant: "destructive"
      });
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
      title: isCorrect ? "Korrekt!" : "Forkert",
      description: isCorrect ? "Godt klaret!" : "Prøv igen næste gang",
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

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const hasAnswered = answers.length > currentQuestionIndex;

  if (isSessionComplete) {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === sessionQuestions[index]?.correct ? 1 : 0);
    }, 0);

    return (
      <LessonComplete
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        subject={subject}
        skillArea={skillArea}
        onRetry={handleRetry}
        onBack={onBack}
      />
    );
  }

  if (generationError) {
    return (
      <ErrorState
        error={generationError}
        onRetry={generateNextQuestion}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SessionTimer
        isActive={isSessionActive}
        onTimeUpdate={setTimeSpent}
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
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
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
          canSkip={!hasAnswered && currentQuestion}
        />
      </Card>
    </div>
  );
};

export default AILearningModule;
