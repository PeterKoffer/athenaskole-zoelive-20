
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionAnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  disabled?: boolean;
}

const QuestionAnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect,
  disabled = false
}: QuestionAnswerOptionsProps) => {
  console.log('🔍 QuestionAnswerOptions Debug:', {
    selectedAnswer,
    correctAnswer,
    showResult,
    disabled,
    options: options.map((opt, idx) => ({ idx, opt }))
  });

  const getButtonClassName = (index: number) => {
    const baseClasses = "w-full text-left justify-start p-4 h-auto relative z-20 transition-all duration-200";
    
    if (selectedAnswer === index) {
      if (showResult) {
        const isCorrect = selectedAnswer === correctAnswer;
        console.log(`🎯 Answer ${index} selected. Correct answer: ${correctAnswer}. Is correct: ${isCorrect}`);
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
    <div className="space-y-3 relative z-10">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          className={getButtonClassName(index)}
          onClick={() => {
            if (!disabled && !showResult) {
              console.log(`🖱️ Button ${index} clicked for option: ${option}`);
              onAnswerSelect(index);
            }
          }}
          disabled={showResult || disabled}
        >
          <span className="mr-3 font-semibold">
            {String.fromCharCode(65 + index)}.
          </span>
          <span className="flex-1">{option}</span>
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
