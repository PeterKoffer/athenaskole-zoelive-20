
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuestionDisplayProps {
  question: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  showResult: boolean;
}

const QuestionDisplay = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  score,
  showResult
}: QuestionDisplayProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span className="text-sm text-gray-400">Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-xl font-semibold text-white">
          {question}
        </h3>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
