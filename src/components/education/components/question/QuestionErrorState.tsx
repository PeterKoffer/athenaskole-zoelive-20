
import { Button } from '@/components/ui/button';

interface QuestionErrorStateProps {
  error: string;
  onRetry: () => void;
}

const QuestionErrorState = ({ error, onRetry }: QuestionErrorStateProps) => {
  return (
    <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center">
      <h3 className="text-white text-lg font-semibold mb-2">Question Generation Error</h3>
      <p className="text-red-300">{error}</p>
      <Button 
        onClick={onRetry} 
        className="mt-4 bg-red-600 hover:bg-red-700"
      >
        Try Again
      </Button>
    </div>
  );
};

export default QuestionErrorState;
