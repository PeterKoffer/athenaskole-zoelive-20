
import { Card, CardContent } from '@/components/ui/card';
import AnswerOptions from '../AnswerOptions';

interface QuestionActivityContentProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  disabled: boolean;
}

const QuestionActivityContent = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  disabled
}: QuestionActivityContentProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <AnswerOptions
          options={options}
          selectedAnswer={selectedAnswer}
          correctAnswer={correctAnswer}
          showResult={showResult}
          onAnswerSelect={onAnswerSelect}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionActivityContent;
