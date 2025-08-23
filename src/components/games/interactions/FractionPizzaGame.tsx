
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pizza, RotateCcw } from 'lucide-react';
import { GameState, GameActions } from '../GameEngine';

interface FractionPizzaGameProps {
  gameState: GameState;
  gameActions: GameActions;
  targetFraction: { numerator: number; denominator: number };
  instruction: string;
  onComplete: (success: boolean) => void;
}

const FractionPizzaGame = ({ 
  gameState, 
  gameActions, 
  targetFraction, 
  instruction, 
  onComplete 
}: FractionPizzaGameProps) => {
  void gameState;
  const [selectedSlices, setSelectedSlices] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const totalSlices = targetFraction.denominator;

  const handleSliceClick = useCallback((sliceIndex: number) => {
    if (gameCompleted) return;

    const newSelectedCount = selectedSlices === sliceIndex + 1 ? 0 : sliceIndex + 1;
    setSelectedSlices(newSelectedCount);
  }, [gameCompleted, selectedSlices]);

  const checkAnswer = useCallback(() => {
    const isCorrect = selectedSlices === targetFraction.numerator;
    
    if (isCorrect) {
      gameActions.updateScore(40);
      gameActions.addAchievement('Pizza Fraction Master');
      setGameCompleted(true);
      setTimeout(() => onComplete(true), 1500);
    } else {
      gameActions.updateScore(-10);
    }
  }, [selectedSlices, targetFraction.numerator, gameActions, onComplete]);

  const resetGame = () => {
    setSelectedSlices(0);
    setGameCompleted(false);
  };

  const renderPizzaSlice = (index: number) => {
    const isSelected = index < selectedSlices;
    const angle = (360 / totalSlices) * index;
    const nextAngle = (360 / totalSlices) * (index + 1);
    
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    const startAngleRad = (angle * Math.PI) / 180;
    const endAngleRad = (nextAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = (nextAngle - angle) > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return (
      <path
        key={index}
        d={pathData}
        fill={isSelected ? '#10b981' : '#374151'}
        stroke="#1f2937"
        strokeWidth="2"
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleSliceClick(index)}
      />
    );
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Pizza Fraction Challenge</h3>
            <p className="text-gray-300">{instruction}</p>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                Target: {targetFraction.numerator}/{targetFraction.denominator}
              </Badge>
              <Badge variant="outline" className="bg-green-900 text-green-400 border-green-400">
                Selected: {selectedSlices}/{totalSlices}
              </Badge>
            </div>
          </div>

          {/* Pizza Visualization */}
          <div className="flex justify-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
                {/* Pizza base */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="#8b4513"
                  stroke="#654321"
                  strokeWidth="3"
                />
                
                {/* Pizza slices */}
                {Array.from({ length: totalSlices }, (_, index) => renderPizzaSlice(index))}
                
                {/* Pizza center */}
                <circle
                  cx="100"
                  cy="100"
                  r="10"
                  fill="#dc2626"
                  className="pointer-events-none"
                />
              </svg>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Pizza className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-300 text-sm">
              Click on the pizza slices to select {targetFraction.numerator} out of {targetFraction.denominator} slices.
              <br />
              Green slices are selected, gray slices are not selected.
            </p>
          </div>

          {/* Answer Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">
              Your Answer: {selectedSlices}/{totalSlices}
            </div>
            
            {selectedSlices > 0 && (
              <div className="text-lg text-gray-300">
                As a decimal: {(selectedSlices / totalSlices).toFixed(2)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-gray-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={checkAnswer}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedSlices === 0 || gameCompleted}
            >
              Check Answer
            </Button>
          </div>

          {/* Success Message */}
          {gameCompleted && selectedSlices === targetFraction.numerator && (
            <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-400">
              <div className="text-green-400 font-semibold">
                🍕 Perfect! You correctly identified {targetFraction.numerator}/{targetFraction.denominator} of the pizza!
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FractionPizzaGame;
