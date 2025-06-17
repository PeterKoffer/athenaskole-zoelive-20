
import { Button } from '@/components/ui/button';

interface QuestionControlsProps {
  selectedAnswer: number | null;
  showResult: boolean;
  isLastQuestion: boolean;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

const QuestionControls = ({
  selectedAnswer,
  showResult,
  isLastQuestion,
  onSubmitAnswer,
  onNextQuestion
}: QuestionControlsProps) => {
  return (
    <div className="text-center">
      {!showResult ? (
        <Button
          onClick={onSubmitAnswer}
          disabled={selectedAnswer === null}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
        >
          Submit Answer
        </Button>
      ) : (
        <Button
          onClick={onNextQuestion}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
        >
          {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
        </Button>
      )}
    </div>
  );
};

export default QuestionControls;
