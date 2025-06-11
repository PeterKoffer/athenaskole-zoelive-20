
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, RotateCcw } from 'lucide-react';
import { GameState, GameActions } from '../GameEngine';

interface NumberLineGameProps {
  gameState: GameState;
  gameActions: GameActions;
  minValue: number;
  maxValue: number;
  targetValue: number;
  instruction: string;
  onComplete: (success: boolean) => void;
}

const NumberLineGame = ({ 
  gameState, 
  gameActions, 
  minValue, 
  maxValue, 
  targetValue, 
  instruction, 
  onComplete 
}: NumberLineGameProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const numberRange = Array.from(
    { length: maxValue - minValue + 1 }, 
    (_, i) => minValue + i
  );

  const handleNumberClick = useCallback((number: number) => {
    if (gameCompleted) return;

    setSelectedValue(number);
    setAttempts(prev => prev + 1);
    setShowFeedback(true);

    const isCorrect = number === targetValue;
    const tolerance = Math.abs(number - targetValue);

    if (isCorrect) {
      gameActions.updateScore(50);
      gameActions.addAchievement('Number Line Champion');
      setGameCompleted(true);
      setTimeout(() => onComplete(true), 1500);
    } else if (tolerance <= 2) {
      gameActions.updateScore(20);
      setTimeout(() => setShowFeedback(false), 1000);
    } else {
      gameActions.updateScore(-5);
      setTimeout(() => setShowFeedback(false), 1000);
    }

    if (attempts >= 2 && !isCorrect) {
      setGameCompleted(true);
      setTimeout(() => onComplete(false), 1500);
    }
  }, [gameCompleted, targetValue, attempts, gameActions, onComplete]);

  const resetGame = () => {
    setSelectedValue(null);
    setAttempts(0);
    setGameCompleted(false);
    setShowFeedback(false);
  };

  const getNumberStyle = (number: number) => {
    if (selectedValue === number) {
      if (number === targetValue) {
        return 'bg-green-600 text-white border-green-400';
      } else {
        const tolerance = Math.abs(number - targetValue);
        if (tolerance <= 2) {
          return 'bg-yellow-600 text-white border-yellow-400';
        }
        return 'bg-red-600 text-white border-red-400';
      }
    }
    return 'bg-gray-700 hover:bg-gray-600 text-white border-gray-500';
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Number Line Challenge</h3>
            <p className="text-gray-300">{instruction}</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                <Target className="w-3 h-3 mr-1" />
                Target: {targetValue}
              </Badge>
              <Badge variant="outline" className="bg-purple-900 text-purple-400 border-purple-400">
                Attempts: {attempts}/3
              </Badge>
            </div>
          </div>

          {/* Number Line */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="text-sm text-gray-400">Click on the number line to find the target!</div>
            </div>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex justify-center space-x-2 min-w-max px-4">
                {numberRange.map((number) => (
                  <button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    disabled={gameCompleted}
                    className={`
                      w-12 h-12 rounded-lg border-2 font-bold text-sm
                      transition-all duration-200 hover:scale-105
                      ${getNumberStyle(number)}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual number line */}
            <div className="relative mt-4">
              <div className="h-2 bg-gray-700 rounded-full relative">
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full -top-1 transform -translate-x-1/2"
                  style={{ 
                    left: `${((targetValue - minValue) / (maxValue - minValue)) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{minValue}</span>
                <span>{maxValue}</span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && selectedValue !== null && (
            <div className="text-center p-4 rounded-lg border">
              {selectedValue === targetValue ? (
                <div className="bg-green-900/20 border-green-400 text-green-400">
                  🎉 Perfect! You found the exact number!
                </div>
              ) : Math.abs(selectedValue - targetValue) <= 2 ? (
                <div className="bg-yellow-900/20 border-yellow-400 text-yellow-400">
                  Close! You're within {Math.abs(selectedValue - targetValue)} of the target.
                </div>
              ) : (
                <div className="bg-red-900/20 border-red-400 text-red-400">
                  Try again! You're {Math.abs(selectedValue - targetValue)} away from the target.
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-gray-600 text-white"
              disabled={gameCompleted && selectedValue === targetValue}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberLineGame;
