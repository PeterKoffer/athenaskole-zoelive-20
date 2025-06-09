
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
    <div className="flex justify-center w-full px-4 sm:px-6 md:px-8">
      {!showResult ? (
        <Button
          onClick={onSubmitAnswer}
          disabled={selectedAnswer === null}
          className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg max-w-xs sm:max-w-sm"
        >
          Submit Answer
        </Button>
      ) : (
        <Button
          onClick={onNextQuestion}
          className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg max-w-xs sm:max-w-sm"
        >
          {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
        </Button>
      )}
    </div>
  );
};

export default LessonControls;
