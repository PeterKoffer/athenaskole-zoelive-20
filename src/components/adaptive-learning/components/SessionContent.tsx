
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import QuestionDisplay from './QuestionDisplay';
import LessonHeader from './LessonHeader';
import { SessionData } from './SessionProvider';

interface SessionContentProps {
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
  const {
    currentQuestion,
    questions,
    hasAnswered,
    selectedAnswer,
    isLoading,
    error,
    handleAnswerSelect
  } = sessionData;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-6 text-center text-white">
            <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Questions</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !questions.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
              <span className="text-white">AI is generating personalized questions...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-6 text-center text-white">
            <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Questions Available</h3>
            <p className="text-yellow-300">Unable to load questions for this session.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-white border-gray-600 hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <LessonHeader
        subject={subject}
        skillArea={skillArea}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        difficultyLevel={difficultyLevel}
        learningObjective={learningObjective}
      />

      <QuestionDisplay
        question={question}
        onAnswerSelect={handleAnswerSelect}
        hasAnswered={hasAnswered}
        selectedAnswer={selectedAnswer}
        autoSubmit={true}
        subject={subject}
      />
    </div>
  );
};

export default SessionContent;
