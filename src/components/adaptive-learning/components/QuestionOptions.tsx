
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  disabled?: boolean;
}

const QuestionOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  disabled = false
}: QuestionOptionsProps) => {
  console.log('🔍 QuestionOptions Debug:', {
    selectedAnswer,
    correctAnswer,
    showResult,
    disabled,
    optionsCount: options.length
  });

  const getOptionClassName = (index: number) => {
    const baseClasses = "w-full text-left justify-start p-3 sm:p-4 h-auto transition-all duration-200 text-sm sm:text-base relative z-20";
    
    if (selectedAnswer === index) {
      if (showResult) {
        const isCorrect = selectedAnswer === correctAnswer;
        console.log(`🎯 Option ${index} selected. Correct: ${correctAnswer}. Is correct: ${isCorrect}`);
        return isCorrect
          ? `${baseClasses} bg-green-600 border-green-500 text-white`
          : `${baseClasses} bg-red-600 border-red-500 text-white`;
      }
      return `${baseClasses} bg-blue-600 border-blue-500 text-white`;
    }
    
    if (showResult && index === correctAnswer) {
      return `${baseClasses} bg-green-600 border-green-500 text-white`;
    }
    
    return `${baseClasses} bg-gray-700 border-gray-600 text-white hover:bg-gray-600`;
  };

  return (
    <div className="space-y-2 sm:space-y-3 px-2 sm:px-0 relative z-10">
      {options.map((option: string, index: number) => (
        <Button
          key={index}
          variant="outline"
          className={getOptionClassName(index)}
          onClick={() => {
            if (!disabled && !showResult && selectedAnswer === null) {
              console.log(`🖱️ QuestionOptions Button ${index} clicked for: ${option}`);
              onAnswerSelect(index);
            }
          }}
          disabled={showResult || selectedAnswer !== null || disabled}
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

export default QuestionOptions;
