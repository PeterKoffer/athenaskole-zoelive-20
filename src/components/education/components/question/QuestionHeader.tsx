
import { Clock } from 'lucide-react';

interface QuestionHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  timeSpent: number;
  question: string;
}

const QuestionHeader = ({
  questionNumber,
  totalQuestions,
  timeSpent,
  question
}: QuestionHeaderProps) => {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300 text-sm">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="text-gray-300 text-sm">
          {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-6">
        {question}
      </h3>
    </div>
  );
};

export default QuestionHeader;
