
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../hooks/useQuestionGeneration';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  onSubmit: () => void;
}

const QuestionDisplay = ({ 
  question, 
  selectedAnswer, 
  showResult, 
  onAnswerSelect, 
  onSubmit 
}: QuestionDisplayProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold text-white mb-4">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            disabled={showResult}
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
            } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
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

      {!showResult && selectedAnswer !== null && (
        <Button 
          onClick={onSubmit}
          className="w-full mt-4 bg-lime-400 hover:bg-lime-500 text-black"
        >
          Submit Answer
        </Button>
      )}
    </>
  );
};

export default QuestionDisplay;
