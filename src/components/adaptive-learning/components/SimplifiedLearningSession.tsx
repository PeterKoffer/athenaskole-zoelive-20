
import { Card, CardContent } from '@/components/ui/card';
import { UnifiedSessionProvider, useUnifiedSession } from '../contexts/UnifiedSessionContext';
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

interface SimplifiedLearningSessionProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const SimplifiedLearningSessionContent = ({ onBack }: { onBack: () => void }) => {
  const {
    subject,
    skillArea,
    currentQuestion,
    selectedAnswer,
    showResult,
    questionNumber,
    correctAnswers,
    totalQuestions,
    isLoading,
    isGenerating,
    error,
    handleAnswerSelect
  } = useUnifiedSession();

  // Handle loading states - simplified since auth is handled in context
  if (isLoading || isGenerating || !currentQuestion) {
    return (
      <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-white">
            {isGenerating ? "Generating question..." : "Loading..."}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
      <SimplifiedSessionHeader
        subject={subject}
        skillArea={skillArea}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        getRecommendedDifficulty={() => 3} // Simplified for now
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

const SimplifiedLearningSession = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: SimplifiedLearningSessionProps) => {
  const totalQuestions = 5;

  return (
    <UnifiedSessionProvider
      subject={subject}
      skillArea={skillArea}
      difficultyLevel={difficultyLevel}
      totalQuestions={totalQuestions}
      onSessionComplete={onBack}
    >
      <SimplifiedLearningSessionContent onBack={onBack} />
    </UnifiedSessionProvider>
  );
};

export default SimplifiedLearningSession;
