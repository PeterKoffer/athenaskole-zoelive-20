
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface QuestionExplanationProps {
  explanation?: string;
  questionNumber: number;
  totalQuestions: number;
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  onReadExplanation: () => void;
}

const QuestionExplanation = ({
  explanation,
  questionNumber,
  totalQuestions,
  autoReadEnabled,
  isSpeaking,
  onReadExplanation
}: QuestionExplanationProps) => {
  if (!explanation) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-medium">Explanation:</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onReadExplanation}
          className="text-slate-950"
          disabled={isSpeaking || !autoReadEnabled}
        >
          <Volume2 className="w-4 h-4 mr-1" />
          Listen
        </Button>
      </div>
      <p className="text-gray-300">{explanation}</p>
      <p className="text-gray-400 text-sm mt-2">
        {questionNumber < totalQuestions ? 'Next grade-appropriate question coming up...' : 'Session completing...'}
      </p>
    </div>
  );
};

export default QuestionExplanation;
