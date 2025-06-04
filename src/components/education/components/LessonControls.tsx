
import { Button } from '@/components/ui/button';

interface LessonControlsProps {
  showResult: boolean;
  selectedAnswer: number | null;
  isLastQuestion: boolean;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

const LessonControls = ({
  showResult,
  selectedAnswer,
  isLastQuestion,
  onSubmitAnswer,
  onNextQuestion
}: LessonControlsProps) => {
  return (
    <div className="flex justify-end">
      {!showResult ? (
        <Button
          onClick={onSubmitAnswer}
          disabled={selectedAnswer === null}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Submit Answer
        </Button>
      ) : (
        <Button
          onClick={onNextQuestion}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
        </Button>
      )}
    </div>
  );
};

export default LessonControls;
