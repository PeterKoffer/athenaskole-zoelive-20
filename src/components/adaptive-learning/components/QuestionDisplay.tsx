
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  explanation?: string;
  standardInfo?: {
    code: string;
    title: string;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (index: number) => void;
  hasAnswered?: boolean;
  autoSubmit?: boolean;
  subject?: string;
}

const QuestionDisplay = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  explanation,
  standardInfo,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  hasAnswered = false,
  autoSubmit = false,
  subject = ''
}: QuestionDisplayProps) => {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          {question}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start p-4 h-auto ${getOptionClassName(index)}`}
            onClick={() => onAnswerSelect(index)}
            disabled={showResult || selectedAnswer !== null}
          >
            <span className="mr-3 font-semibold">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
            {showResult && index === correctAnswer && (
              <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
            )}
            {showResult && selectedAnswer === index && index !== correctAnswer && (
              <XCircle className="w-5 h-5 ml-auto text-red-400" />
            )}
          </Button>
        ))}
      </div>

      {showResult && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Explanation:</h4>
          <p className="text-gray-300">{explanation}</p>
          <p className="text-gray-400 text-sm mt-2">
            {questionNumber < totalQuestions ? 'Next grade-appropriate question coming up...' : 'Session completing...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
