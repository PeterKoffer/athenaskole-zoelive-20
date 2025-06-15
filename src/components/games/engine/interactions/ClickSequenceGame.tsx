
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MousePointer, CheckCircle, XCircle } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface ClickSequenceGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

interface SequenceItem {
  id: string;
  value: number;
  isCorrect: boolean;
  clicked: boolean;
}

const generateSequence = (level: number): SequenceItem[] => {
  const sequenceLength = 4 + level;
  const sequence: SequenceItem[] = [];
  
  // Generate a simple counting sequence with some incorrect options
  for (let i = 1; i <= sequenceLength + 2; i++) {
    sequence.push({
      id: `item-${i}`,
      value: i,
      isCorrect: i <= sequenceLength,
      clicked: false
    });
  }
  
  // Shuffle the array
  return sequence.sort(() => Math.random() - 0.5);
};

const ClickSequenceGame = ({ level, onLevelComplete, gameData }: ClickSequenceGameProps) => {
  const [sequence, setSequence] = useState(() => generateSequence(level));
  const [currentStep, setCurrentStep] = useState(1);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const handleItemClick = (item: SequenceItem) => {
    if (item.clicked || gameComplete) return;
    
    const updatedSequence = sequence.map(seqItem =>
      seqItem.id === item.id ? { ...seqItem, clicked: true } : seqItem
    );
    
    setSequence(updatedSequence);
    
    if (item.value === currentStep && item.isCorrect) {
      // Correct click
      const points = 20 - mistakes * 2; // Fewer points for mistakes
      setScore(prev => prev + Math.max(points, 5));
      setCurrentStep(prev => prev + 1);
      
      // Check if sequence complete
      if (currentStep === 4 + level) {
        setGameComplete(true);
        setTimeout(() => {
          onLevelComplete(score + Math.max(points, 5), mistakes === 0);
        }, 1500);
      }
    } else {
      // Wrong click
      setMistakes(prev => prev + 1);
    }
  };

  const getItemColor = (item: SequenceItem) => {
    if (!item.clicked) {
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
    
    if (item.value === currentStep - 1 && item.isCorrect) {
      return 'bg-green-600 text-white';
    }
    
    return 'bg-red-600 text-white';
  };

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <MousePointer className="w-6 h-6 mr-2 text-orange-400" />
            Click Sequence Challenge
          </span>
          <Badge className="bg-orange-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-2">
            Click the numbers in order: 1 to {4 + level}
          </h2>
          <p className="text-gray-400">
            Next number: <span className="text-orange-400 font-bold">{currentStep}</span>
          </p>
          <p className="text-gray-400">
            Score: {score} | Mistakes: {mistakes}
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {sequence.map(item => (
            <Button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.clicked || gameComplete}
              className={`
                h-16 text-2xl font-bold transition-all duration-200 
                ${getItemColor(item)}
                ${item.clicked ? 'transform scale-95' : 'transform hover:scale-105'}
              `}
            >
              {item.value}
              {item.clicked && item.value === currentStep - 1 && item.isCorrect && (
                <CheckCircle className="w-5 h-5 ml-2" />
              )}
              {item.clicked && (item.value !== currentStep - 1 || !item.isCorrect) && (
                <XCircle className="w-5 h-5 ml-2" />
              )}
            </Button>
          ))}
        </div>

        {gameComplete && (
          <div className="bg-green-900 border-green-500 border-2 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {mistakes === 0 ? 'Perfect Sequence! 🎉' : 'Sequence Complete! 👏'}
            </h3>
            <p className="text-green-200">
              You clicked all numbers in the correct order!
            </p>
            {mistakes === 0 && (
              <p className="text-yellow-300 font-bold">Perfect bonus earned!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClickSequenceGame;
