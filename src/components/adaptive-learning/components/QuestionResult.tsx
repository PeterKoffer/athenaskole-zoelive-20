
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../hooks/useQuestionGeneration';

interface QuestionResultProps {
  question: Question;
  selectedAnswer: number | null;
  isCorrect: boolean;
}

const QuestionResult = ({ question, selectedAnswer, isCorrect }: QuestionResultProps) => {
  return (
    <Card className="mt-4 bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="font-semibold text-white">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </span>
        </div>
        <p className="text-gray-300 text-sm mb-3">{question.explanation}</p>
        {question.learningObjectives.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-200 mb-2">Learning Objectives:</p>
            <div className="flex flex-wrap gap-2">
              {question.learningObjectives.map((objective, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-lime-100 text-gray-900 border-lime-300 px-2 py-1"
                >
                  {objective}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionResult;
