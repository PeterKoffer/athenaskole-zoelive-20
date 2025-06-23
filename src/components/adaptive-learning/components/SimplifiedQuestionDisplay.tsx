
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
  console.log('🔍 SimplifiedQuestionDisplay Debug:', {
    selectedAnswer,
    correctAnswer: currentQuestion.correct,
    showResult,
    question: currentQuestion.question
  });

  return (
    <div className="space-y-6">
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
          
          let buttonClass = 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
          
          if (isSelected && !showResult) {
            buttonClass = 'bg-blue-600 border-blue-500 text-white';
          } else if (showCorrect) {
            buttonClass = 'bg-green-600 border-green-500 text-white';
          } else if (showIncorrect) {
            buttonClass = 'bg-red-600 border-red-500 text-white';
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={`w-full text-left justify-start p-4 h-auto relative z-10 ${buttonClass}`}
              onClick={() => {
                console.log(`🖱️ SimplifiedQuestion Button ${index} clicked. Correct answer: ${currentQuestion.correct}`);
                onAnswerSelect(index);
              }}
              disabled={showResult || selectedAnswer !== null}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
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
