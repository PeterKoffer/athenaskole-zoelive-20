
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameState {
  score: number;
  level: number;
  lives: number;
}

interface EducationalGameEngineProps {
  subject: string;
  onGameComplete: (score: number) => void;
}

const EducationalGameEngine = ({ subject, onGameComplete }: EducationalGameEngineProps) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3
  });

  const handleStartGame = () => {
    console.log('Starting educational game for:', subject);
    setGameState({
      score: 0,
      level: 1,
      lives: 3
    });
  };

  const handleCompleteGame = () => {
    onGameComplete(gameState.score);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Educational Game Engine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-white">
          <p>Subject: {subject}</p>
          <p>Score: {gameState.score}</p>
          <p>Level: {gameState.level}</p>
          <p>Lives: {gameState.lives}</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleStartGame} className="bg-blue-600 hover:bg-blue-700">
            Start Game
          </Button>
          <Button onClick={handleCompleteGame} className="bg-green-600 hover:bg-green-700">
            Complete Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalGameEngine;
