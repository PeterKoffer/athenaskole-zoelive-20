
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
  const totalQuestions = 5;

  const handleRetry = () => {
    // Force component remount by updating key
    window.location.reload();
  };

  return (
    <SessionProvider
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      learningObjective={learningObjective}
    >
      {(sessionData) => {
        if (sessionData.isSessionComplete) {
          return (
            <SessionComplete
              subject={subject}
              skillArea={skillArea}
              answers={sessionData.answers}
              sessionQuestions={sessionData.sessionQuestions}
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
