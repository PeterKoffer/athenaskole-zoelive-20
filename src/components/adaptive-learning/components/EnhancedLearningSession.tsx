
import { useState } from "react";
import SessionProvider from "./SessionProvider";
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
    <SessionProvider
      key={sessionKey}
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      learningObjective={learningObjective}
    >
      {(sessionData) => {
        console.log('📊 SessionData:', {
          isSessionComplete: sessionData.isSessionComplete,
          questionsLength: sessionData.questions.length,
          currentIndex: sessionData.currentQuestionIndex,
          isLoading: sessionData.isLoading,
          error: sessionData.error
        });

        if (sessionData.isSessionComplete) {
          return (
            <SessionComplete
              subject={subject}
              skillArea={skillArea}
              answers={sessionData.answers}
              sessionQuestions={sessionData.questions}
              totalQuestions={totalQuestions}
              onRetry={handleRetry}
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
      }}
    </SessionProvider>
  );
};

export default EnhancedLearningSession;
