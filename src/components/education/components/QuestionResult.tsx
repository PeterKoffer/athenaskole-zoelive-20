
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionResultProps {
  showResult: boolean;
  isCorrect: boolean;
  explanation?: string;
  isLastQuestion: boolean;
}

const QuestionResult = ({
  showResult,
  isCorrect,
  explanation
}: QuestionResultProps) => {
  if (!showResult) return null;

  return (
    <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400 mr-3" />
        )}
        <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct! Well done!' : 'Incorrect, but keep trying!'}
        </span>
      </div>
      
      {explanation && (
        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Explanation:</h4>
          <p className="text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionResult;
