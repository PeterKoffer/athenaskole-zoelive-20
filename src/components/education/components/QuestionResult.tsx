
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionResultProps {
  showResult: boolean;
  isCorrect: boolean;
  explanation: string;
  isLastQuestion: boolean;
}

const QuestionResult = ({
  showResult,
  isCorrect,
  explanation,
  isLastQuestion
}: QuestionResultProps) => {
  if (!showResult) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center mb-2">
        {isCorrect ? (
          <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 mr-2 text-red-400" />
        )}
        <span className={
          isCorrect 
            ? 'text-green-400 font-semibold' 
            : 'text-red-400 font-semibold'
        }>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </span>
      </div>
      <p className="text-gray-300 mb-3">{explanation}</p>
      {isLastQuestion ? (
        <p className="text-gray-400 text-sm">Lesson completing...</p>
      ) : (
        <p className="text-gray-400 text-sm">Next question coming up...</p>
      )}
    </div>
  );
};

export default QuestionResult;
