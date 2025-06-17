
import { Button } from '@/components/ui/button';

interface QuestionActivityControlsProps {
  onTryAgain: () => void;
  onContinue: () => void;
}

const QuestionActivityControls = ({
  onTryAgain,
  onContinue
}: QuestionActivityControlsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button
        onClick={onTryAgain}
        variant="outline"
        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
      >
        Try Another Question
      </Button>
      <Button
        onClick={onContinue}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Continue
      </Button>
    </div>
  );
};

export default QuestionActivityControls;
