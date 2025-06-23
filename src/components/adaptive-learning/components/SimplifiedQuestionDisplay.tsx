
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface SimplifiedQuestionDisplayProps {
  currentQuestion: any;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  disabled?: boolean;
}

const SimplifiedQuestionDisplay = ({
  currentQuestion,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  disabled = false
}: SimplifiedQuestionDisplayProps) => {
  console.log('🔍 SimplifiedQuestionDisplay Debug:', {
    selectedAnswer,
    correctAnswer: currentQuestion.correct,
    showResult,
    disabled,
    question: currentQuestion.question
  });

  const getButtonClassName = (index: number) => {
    const baseClasses = "w-full text-left justify-start p-4 h-auto relative z-20 transition-all duration-200";
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correct;
    const showCorrect = showResult && isCorrect;
    const showIncorrect = showResult && isSelected && !isCorrect;
    
    if (isSelected && !showResult) {
      return `${baseClasses} bg-blue-600 border-blue-500 text-white`;
    } else if (showCorrect) {
      return `${baseClasses} bg-green-600 border-green-500 text-white`;
    } else if (showIncorrect) {
      return `${baseClasses} bg-red-600 border-red-500 text-white`;
    }
    
    return `${baseClasses} bg-gray-700 border-gray-600 text-white hover:bg-gray-600`;
  };

  return (
    <div className="space-y-6 relative z-10">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option: string, index: number) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correct;
          const showCorrect = showResult && isCorrect;
          const showIncorrect = showResult && isSelected && !isCorrect;

          return (
            <Button
              key={index}
              variant="outline"
              className={getButtonClassName(index)}
              onClick={() => {
                if (!disabled && !showResult && selectedAnswer === null) {
                  console.log(`🖱️ SimplifiedQuestion Button ${index} clicked. Correct answer: ${currentQuestion.correct}`);
                  onAnswerSelect(index);
                }
              }}
              disabled={showResult || selectedAnswer !== null || disabled}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {showCorrect && (
                <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
              )}
              {showIncorrect && (
                <XCircle className="w-5 h-5 ml-auto text-red-400" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SimplifiedQuestionDisplay;
