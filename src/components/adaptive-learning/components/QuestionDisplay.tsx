
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../hooks/useQuestionGeneration';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  autoSubmit?: boolean;
}

const QuestionDisplay = ({ 
  question, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect,
  autoSubmit = false
}: QuestionDisplayProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={showResult || (autoSubmit && selectedAnswer !== null)}
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              selectedAnswer === index
                ? showResult
                  ? index === question.correct
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-red-600 border-red-500 text-white'
                  : 'bg-lime-600 border-lime-500 text-white'
                : showResult && index === question.correct
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
            } ${showResult || (autoSubmit && selectedAnswer !== null) ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && (
                <>
                  {index === question.correct && <CheckCircle className="w-5 h-5 text-green-300" />}
                  {selectedAnswer === index && index !== question.correct && (
                    <XCircle className="w-5 h-5 text-red-300" />
                  )}
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {autoSubmit && selectedAnswer !== null && !showResult && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-lime-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
            <span className="text-sm">Processing answer...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionDisplay;
