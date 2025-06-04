
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onAnswerSelect: (answerIndex: number) => void;
}

const AnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onAnswerSelect
}: AnswerOptionsProps) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={selectedAnswer === index ? "default" : "outline"}
          className={`w-full text-left justify-start p-4 h-auto ${
            selectedAnswer === index
              ? "bg-blue-500 text-white"
              : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          } ${
            showResult && index === correctAnswer
              ? "bg-green-600 text-white"
              : ""
          } ${
            showResult && selectedAnswer === index && index !== correctAnswer
              ? "bg-red-600 text-white"
              : ""
          }`}
          onClick={() => onAnswerSelect(index)}
          disabled={showResult}
        >
          <span className="mr-3 font-semibold">
            {String.fromCharCode(65 + index)}.
          </span>
          {option}
          {showResult && index === correctAnswer && (
            <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
          )}
          {showResult && selectedAnswer === index && index !== correctAnswer && (
            <XCircle className="w-5 h-5 ml-auto text-red-200" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
