
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain } from 'lucide-react';

interface SessionResultsCardProps {
  questionsCompleted: number;
  sessionScore: number;
  difficulty: number;
  performanceAccuracy: number;
  onRetry: () => void;
  onBack: () => void;
}

const SessionResultsCard = ({ 
  questionsCompleted, 
  sessionScore, 
  difficulty, 
  performanceAccuracy,
  onRetry, 
  onBack 
}: SessionResultsCardProps) => {
  const finalScore = questionsCompleted > 0 ? Math.round(sessionScore / questionsCompleted) : 0;

  return (
    <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <BarChart3 className="w-5 h-5 text-lime-400" />
          <span>Session Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-lime-400">{questionsCompleted}</div>
            <div className="text-sm text-gray-300">Spørgsmål gennemført</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-lime-400">{finalScore}%</div>
            <div className="text-sm text-gray-300">Gennemsnitsscore</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-lime-400">{difficulty}</div>
            <div className="text-sm text-gray-300">Sværhedsgrad</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-lime-400">{Math.round(performanceAccuracy)}%</div>
            <div className="text-sm text-gray-300">Nøjagtighed</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onRetry}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black"
          >
            <Brain className="w-4 h-4 mr-2" />
            Start ny session
          </Button>
          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-700"
          >
            Tilbage til oversigt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionResultsCard;
