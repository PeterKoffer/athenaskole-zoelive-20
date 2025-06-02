
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock } from 'lucide-react';

interface QuestionHeaderProps {
  timeLeft: number;
  estimatedTime: number;
}

const QuestionHeader = ({ timeLeft, estimatedTime }: QuestionHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-white">
        <span className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-lime-400" />
          <span>AI Generated Question</span>
        </span>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{timeLeft}s</span>
        </div>
      </CardTitle>
      <Progress value={((estimatedTime - timeLeft) / estimatedTime) * 100} className="mb-4" />
    </CardHeader>
  );
};

export default QuestionHeader;
