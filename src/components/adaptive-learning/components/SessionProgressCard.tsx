
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface SessionProgressCardProps {
  difficulty: number;
  questionsCompleted: number;
  performanceAccuracy: number;
}

const SessionProgressCard = ({ 
  difficulty, 
  questionsCompleted, 
  performanceAccuracy 
}: SessionProgressCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-lime-400" />
            <span className="text-white font-medium">AI Learning Session</span>
          </div>
          <Badge className="bg-lime-400 text-black">
            Level {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Spørgsmål: {questionsCompleted}/5</span>
          <span>Nøjagtighed: {Math.round(performanceAccuracy)}%</span>
        </div>
        
        <Progress 
          value={(questionsCompleted / 5) * 100} 
          className="h-2" 
        />
      </CardContent>
    </Card>
  );
};

export default SessionProgressCard;
