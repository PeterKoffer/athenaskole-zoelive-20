
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionBadge from './QuestionBadge';
import AnswerOption from './AnswerOption';
import { Question } from '../hooks/useQuestionGeneration';

interface QuestionCardProps {
  question: Question;
  hasAnswered: boolean;
  selectedAnswer?: number;
  tempSelected: number | null;
  onOptionClick: (index: number) => void;
}

const QuestionCard = ({ 
  question, 
  hasAnswered, 
  selectedAnswer, 
  tempSelected, 
  onOptionClick 
}: QuestionCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">{question.question}</CardTitle>
          <QuestionBadge estimatedTime={question.estimatedTime} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            option={option}
            index={index}
            hasAnswered={hasAnswered}
            isCorrect={index === question.correct}
            isSelected={index === selectedAnswer}
            isTempSelected={index === tempSelected}
            onClick={() => onOptionClick(index)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
