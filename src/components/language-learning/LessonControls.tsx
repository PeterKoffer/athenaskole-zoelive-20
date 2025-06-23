
import { Button } from "@/components/ui/button";

interface LessonControlsProps {
  showResult: boolean;
  isExerciseSection: boolean;
  hasCurrentQuestion: boolean;
  selectedAnswer: string | number | undefined;
  onCheckAnswer: () => void;
  onNext: () => void;
  isLastSection: boolean;
}

const LessonControls = ({
  showResult,
  isExerciseSection,
  hasCurrentQuestion,
  selectedAnswer,
  onCheckAnswer,
  onNext,
  isLastSection
}: LessonControlsProps) => {
  if (showResult) {
    return null; // Result card handles the next button
  }

  if (isExerciseSection && hasCurrentQuestion) {
    return (
      <Button
        onClick={onCheckAnswer}
        disabled={selectedAnswer === undefined}
        className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-500"
      >
        Check Answer
      </Button>
    );
  }

  if (!isExerciseSection || !hasCurrentQuestion) {
    return (
      <Button
        onClick={onNext}
        className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600"
      >
        {isLastSection ? 'Finish Lesson' : 'Next Section'}
      </Button>
    );
  }

  return null;
};

export default LessonControls;
