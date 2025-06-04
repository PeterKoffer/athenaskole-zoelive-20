
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface SimplifiedQuestionDisplayProps {
  currentQuestion: any;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const SimplifiedQuestionDisplay = ({
  currentQuestion,
  selectedAnswer,
  showResult,
  onAnswerSelect
}: SimplifiedQuestionDisplayProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option: string, index: number) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start p-4 h-auto ${
              selectedAnswer === index
                ? showResult
                  ? selectedAnswer === currentQuestion.correct
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-red-600 border-red-500 text-white'
                  : 'bg-blue-600 border-blue-500 text-white'
                : showResult && index === currentQuestion.correct
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
            }`}
            onClick={() => onAnswerSelect(index)}
            disabled={showResult || selectedAnswer !== null}
          >
            <span className="mr-3 font-semibold">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
            {showResult && index === currentQuestion.correct && (
              <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
            )}
            {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
              <XCircle className="w-5 h-5 ml-auto text-red-400" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SimplifiedQuestionDisplay;
