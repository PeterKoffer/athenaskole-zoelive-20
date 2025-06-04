
import { Card, CardContent } from '@/components/ui/card';
import { useSimplifiedSessionState } from './SimplifiedSessionState';
import SimplifiedSessionHeader from './SimplifiedSessionHeader';
import SimplifiedQuestionDisplay from './SimplifiedQuestionDisplay';
import SimplifiedSessionExplanation from './SimplifiedSessionExplanation';
import SimplifiedSessionLoadingStates from './SimplifiedSessionLoadingStates';

interface SimplifiedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const SimplifiedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: SimplifiedLearningSessionProps) => {
  const totalQuestions = 5;
  
  const {
    user,
    currentQuestion,
    selectedAnswer,
    showResult,
    questionNumber,
    correctAnswers,
    isGenerating,
    getRecommendedDifficulty,
    handleAnswerSelect
  } = useSimplifiedSessionState({
    subject,
    skillArea,
    difficultyLevel,
    totalQuestions,
    onBack
  });

  // Handle loading states
  const loadingComponent = SimplifiedSessionLoadingStates({
    user,
    isGenerating,
    currentQuestion,
    onBack
  });

  if (loadingComponent) {
    return loadingComponent;
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <SimplifiedSessionHeader
        subject={subject}
        skillArea={skillArea}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        getRecommendedDifficulty={getRecommendedDifficulty}
        onBack={onBack}
      />

      <CardContent className="p-6">
        <SimplifiedQuestionDisplay
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswerSelect={handleAnswerSelect}
        />

        <SimplifiedSessionExplanation
          currentQuestion={currentQuestion}
          showResult={showResult}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </CardContent>
    </Card>
  );
};

export default SimplifiedLearningSession;
