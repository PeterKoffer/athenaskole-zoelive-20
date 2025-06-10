
import { useState } from "react";
import { UnifiedSessionProvider, useUnifiedSession } from "../contexts/UnifiedSessionContext";
import SessionComplete from "./SessionComplete";
import SessionContent from "./SessionContent";

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

const EnhancedLearningSessionContent = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  totalQuestions, 
  onBack, 
  onRetry, 
  learningObjective 
}: {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  totalQuestions: number;
  onBack: () => void;
  onRetry: () => void;
  learningObjective?: any;
}) => {
  const sessionData = useUnifiedSession();

  console.log('📊 SessionData:', {
    isSessionComplete: sessionData.isSessionComplete,
    questionsLength: sessionData.questions.length,
    answersLength: sessionData.answers.length,
    currentIndex: sessionData.currentQuestionIndex,
    isLoading: sessionData.isLoading,
    error: sessionData.error
  });

  if (sessionData.isSessionComplete) {
    // Convert complex answers to simple scores for SessionComplete
    const answerScores = sessionData.answers.map(answer => 
      answer.isCorrect ? 1 : 0
    );

    return (
      <SessionComplete
        subject={subject}
        skillArea={skillArea}
        answers={answerScores}
        sessionQuestions={sessionData.questions}
        totalQuestions={totalQuestions}
        onRetry={onRetry}
        onBack={onBack}
      />
    );
  }

  return (
    <SessionContent
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onBack={onBack}
      learningObjective={learningObjective}
      sessionData={sessionData}
    />
  );
};

const EnhancedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack,
  learningObjective 
}: EnhancedLearningSessionProps) => {
  const [sessionKey, setSessionKey] = useState(0);
  const totalQuestions = 5;

  console.log('🎯 EnhancedLearningSession rendering with:', {
    subject,
    skillArea,
    difficultyLevel,
    sessionKey,
    totalQuestions
  });

  const handleRetry = () => {
    console.log('🔄 Retrying session, incrementing key');
    setSessionKey(prev => prev + 1);
  };

  return (
    <UnifiedSessionProvider
      key={sessionKey}
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onSessionComplete={onBack}
    >
      <EnhancedLearningSessionContent
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={difficultyLevel}
        totalQuestions={totalQuestions}
        onBack={onBack}
        onRetry={handleRetry}
        learningObjective={learningObjective}
      />
    </UnifiedSessionProvider>
  );
};

export default EnhancedLearningSession;
