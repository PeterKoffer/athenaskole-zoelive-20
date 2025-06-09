
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  disabled?: boolean;
}

const AnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  disabled = false
}: AnswerOptionsProps) => {
  const getOptionClassName = (index: number) => {
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
    <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
      {options.map((option: string, index: number) => (
        <Button
          key={index}
          variant="outline"
          className={`w-full text-left justify-start p-3 sm:p-4 h-auto transition-all duration-200 text-sm sm:text-base ${getOptionClassName(index)}`}
          onClick={() => !disabled && !showResult && onAnswerSelect(index)}
          disabled={showResult || disabled}
        >
          <span className="mr-2 sm:mr-3 font-semibold text-base sm:text-lg">
            {String.fromCharCode(65 + index)}.
          </span>
          <span className="flex-1 break-words">{option}</span>
          {showResult && index === correctAnswer && (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-green-400 flex-shrink-0" />
          )}
          {showResult && selectedAnswer === index && index !== correctAnswer && (
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-red-400 flex-shrink-0" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
