
import { UnifiedSessionProvider, useUnifiedSession } from '../contexts/UnifiedSessionContext';
import SessionLoadingView from './SessionLoadingView';
import SessionErrorView from './SessionErrorView';
import SessionQuestionView from './SessionQuestionView';

interface LearningSessionProps {
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
}

const LearningSessionContent = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective
}: Omit<LearningSessionProps, 'onBack'> & { onBack: () => void }) => {
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    hasAnswered,
    showResult,
    isLoading,
    timers,
    generateNextQuestion,
    handleAnswerSelect
  } = useUnifiedSession();

  if (isLoading && !currentQuestion) {
    return (
      <SessionLoadingView
        subject={subject}
        onBack={onBack}
        onGenerate={generateNextQuestion}
        showGenerateButton={false}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <SessionErrorView
        onBack={onBack}
        onGenerate={generateNextQuestion}
      />
    );
  }

  return (
    <SessionQuestionView
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onBack={onBack}
      learningObjective={learningObjective}
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      selectedAnswer={selectedAnswer}
      showResult={showResult}
      hasAnswered={hasAnswered}
      totalResponseTime={Date.now() - timers.sessionStartTime} // Use unified timer
      onAnswerSelect={handleAnswerSelect}
    />
  );
};

const LearningSession = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective
}: LearningSessionProps) => {
  return (
    <UnifiedSessionProvider
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onSessionComplete={onBack}
    >
      <LearningSessionContent
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={difficultyLevel}
        totalQuestions={totalQuestions}
        onBack={onBack}
        learningObjective={learningObjective}
      />
    </UnifiedSessionProvider>
  );
};

export default LearningSession;
