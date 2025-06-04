
import { useSessionState } from '../hooks/useSessionState';
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

const LearningSession = ({
  subject,
  skillArea,
  difficultyLevel,
  totalQuestions,
  onBack,
  learningObjective
}: LearningSessionProps) => {
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    hasAnswered,
    showResult,
    isLoading,
    totalResponseTime,
    generateNextQuestion,
    handleAnswerSelect
  } = useSessionState({
    subject,
    skillArea,
    difficultyLevel,
    totalQuestions
  });

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
      totalResponseTime={totalResponseTime}
      onAnswerSelect={handleAnswerSelect}
    />
  );
};

export default LearningSession;
