
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionAnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
}

const QuestionAnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect
}: QuestionAnswerOptionsProps) => {
  const getButtonClassName = (index: number) => {
    if (selectedAnswer === index) {
      if (showResult) {
        return selectedAnswer === correctAnswer
          ? 'bg-green-600 border-green-500 text-white'
          : 'bg-red-600 border-red-500 text-white';
      }
      return 'bg-blue-600 border-blue-500 text-white';
    }
    
    if (showResult && index === correctAnswer) {
      return 'bg-green-600 border-green-500 text-white';
    }
    
    return 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          className={`w-full text-left justify-start p-4 h-auto ${getButtonClassName(index)}`}
          onClick={() => onAnswerSelect(index)}
          disabled={showResult}
        >
          <span className="mr-3 font-semibold">
            {String.fromCharCode(65 + index)}.
          </span>
          {option}
          {showResult && index === correctAnswer && (
            <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
          )}
          {showResult && selectedAnswer === index && selectedAnswer !== correctAnswer && (
            <XCircle className="w-5 h-5 ml-auto text-red-400" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default QuestionAnswerOptions;
