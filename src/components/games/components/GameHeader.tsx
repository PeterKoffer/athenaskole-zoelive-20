
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target, ArrowLeft } from 'lucide-react';
import { GameState, GameConfig } from '../GameEngine';

interface GameHeaderProps {
  gameConfig: GameConfig;
  gameState: GameState;
  scorePercentage: number;
  onBack: () => void;
}

export const GameHeader = ({ gameConfig, gameState, scorePercentage, onBack }: GameHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack} className="border-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="text-white">{gameConfig.title}</CardTitle>
              <p className="text-gray-400 text-sm">{gameConfig.subject} • Level {gameState.level}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
              <Trophy className="w-3 h-3 mr-1" />
              {gameState.score}
            </Badge>
            <Badge variant="outline" className="bg-green-900 text-green-400 border-green-400">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(gameState.timeElapsed)}
            </Badge>
            <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
              ❤️ {gameState.lives}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Current Objective</span>
              <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
                <Target className="w-3 h-3 mr-1" />
                {gameConfig.interactionType}
              </Badge>
            </div>
            <p className="text-gray-300">{gameState.currentObjective}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Progress</span>
              <span className="text-sm text-gray-400">{scorePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={scorePercentage} className="h-2" />
          </div>

          {gameState.achievements.length > 0 && (
            <div>
              <span className="text-sm font-medium text-white">Recent Achievements</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {gameState.achievements.slice(-3).map((achievement, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-900 text-yellow-400 border-yellow-400 text-xs">
                    🏆 {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
