
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface EducationalGameActivityProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const EducationalGameActivity = ({ activity, onActivityComplete }: EducationalGameActivityProps) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const gameContent = activity.content;
  const gameType = gameContent?.gameType || 'general';

  const handleStartGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleGameAction = useCallback((action: string) => {
    console.log(`🎮 Game action: ${action}`);
    setScore(prev => prev + 10);
    
    if (currentChallenge < 2) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      setGameState('completed');
      setTimeout(() => onActivityComplete(true), 1500);
    }
  }, [currentChallenge, onActivityComplete]);

  if (gameState === 'intro') {
    return (
      <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-3xl font-bold text-white mb-4">{activity.title}</h3>
            <p className="text-purple-200 text-lg mb-6">
              {gameContent?.description || "Get ready for an exciting educational game!"}
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Badge className="bg-yellow-600 text-white px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Educational Game
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Fun Learning
            </Badge>
          </div>

          <Button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-bold transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="w-6 h-6 mr-3" />
            Start Game!
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'playing') {
    return (
      <Card className="bg-gradient-to-br from-green-900 to-teal-900 border-green-400">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <div className="flex space-x-4">
              <Badge className="bg-yellow-600 text-white px-3 py-1">
                Score: {score}
              </Badge>
              <Badge className="bg-blue-600 text-white px-3 py-1">
                Challenge: {currentChallenge + 1}/3
              </Badge>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h4 className="text-xl text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              Challenge {currentChallenge + 1}
            </h4>
            <p className="text-gray-300 mb-6">
              {gameContent?.challenges?.[currentChallenge] || 
               `Complete this ${gameType} challenge to earn points!`}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleGameAction('action1')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                Option A
              </Button>
              <Button
                onClick={() => handleGameAction('action2')}
                className="bg-green-600 hover:bg-green-700 text-white py-3"
              >
                Option B
              </Button>
              <Button
                onClick={() => handleGameAction('action3')}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3"
              >
                Option C
              </Button>
              <Button
                onClick={() => handleGameAction('action4')}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3"
              >
                Option D
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 border-yellow-400">
      <CardContent className="p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-3xl font-bold text-white mb-4">Game Complete!</h3>
        <p className="text-yellow-200 text-xl mb-6">
          Fantastic work! You scored {score} points!
        </p>
        <div className="text-4xl mb-6">⭐⭐⭐</div>
        <p className="text-yellow-300">
          You've mastered this educational game challenge!
        </p>
      </CardContent>
    </Card>
  );
};

export default EducationalGameActivity;
