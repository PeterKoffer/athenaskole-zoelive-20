
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: number;
}

interface MathQuestionProps {
  question: Question;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswerSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const MathQuestion = ({
  question,
  selectedAnswer,
  showResult,
  onAnswerSelect,
  onSubmit,
  onNext,
  isLastQuestion
}: MathQuestionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6 text-white">
        {question.question}
      </h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "default" : "outline"}
            className={`w-full text-left justify-start p-4 h-auto ${
              selectedAnswer === index
                ? "bg-blue-500 text-white"
                : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            }`}
            onClick={() => !showResult && onAnswerSelect(index)}
            disabled={showResult}
          >
            <span className="mr-3 font-semibold">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </Button>
        ))}
      </div>

      {showResult && (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <CheckCircle className={`w-5 h-5 mr-2 ${
              selectedAnswer === question.correct 
                ? 'text-green-400' 
                : 'text-red-400'
            }`} />
            <span className={selectedAnswer === question.correct 
              ? 'text-green-400 font-semibold' 
              : 'text-red-400 font-semibold'
            }>
              {selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="text-gray-300">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <Button
            onClick={onSubmit}
            disabled={selectedAnswer === null}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MathQuestion;
