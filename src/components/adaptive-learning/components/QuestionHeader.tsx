
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Trophy } from 'lucide-react';

interface QuestionHeaderProps {
  timeLeft: number;
  estimatedTime: number;
  currentQuestion?: number;
  totalQuestions?: number;
  score?: number;
}

const QuestionHeader = ({ 
  timeLeft, 
  estimatedTime, 
  currentQuestion = 1, 
  totalQuestions = 1,
  score = 0
}: QuestionHeaderProps) => {
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;
  
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-lime-400" />
          <span>AI Generated Question</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{score}/{totalQuestions}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{timeLeft}s</span>
          </div>
        </div>
      </CardTitle>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Question {currentQuestion} of {totalQuestions}</span>
          <span>Lesson Progress</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </CardHeader>
  );
};

export default QuestionHeader;
