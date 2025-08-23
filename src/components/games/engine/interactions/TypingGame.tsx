
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, CheckCircle, Clock } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface TypingGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

interface TypingChallenge {
  prompt: string;
  answer: string;
  points: number;
  timeLimit: number;
}

const generateChallenges = (level: number): TypingChallenge[] => {
  const baseChallenges = [
    { prompt: "What is 8 + 7?", answer: "15", points: 20, timeLimit: 30 },
    { prompt: "Type the word: TRIANGLE", answer: "triangle", points: 15, timeLimit: 20 },
    { prompt: "What is 12 - 5?", answer: "7", points: 20, timeLimit: 25 },
    { prompt: "Type the word: RECTANGLE", answer: "rectangle", points: 25, timeLimit: 25 },
    { prompt: "What is 6 × 4?", answer: "24", points: 30, timeLimit: 35 },
  ];
  
  return baseChallenges.slice(0, 2 + level);
};

const TypingGame = ({ level, onLevelComplete, gameData }: TypingGameProps) => {
  void gameData;
  const [challenges] = useState(() => generateChallenges(level));
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentChallenge = challenges[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex === challenges.length - 1;

  useEffect(() => {
    if (currentChallenge && !showResult) {
      setTimeLeft(currentChallenge.timeLimit);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentChallengeIndex, showResult]);

  const handleSubmit = () => {
    if (showResult || isComplete) return;
    
    const isCorrect = userInput.toLowerCase().trim() === currentChallenge.answer.toLowerCase();
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 2);
      const totalPoints = currentChallenge.points + timeBonus;
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastChallenge) {
      setIsComplete(true);
      const perfect = correctAnswers === challenges.length;
      onLevelComplete(score, perfect);
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
      setUserInput('');
      setShowResult(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      handleSubmit();
    }
  };

  const isCorrect = userInput.toLowerCase().trim() === currentChallenge.answer.toLowerCase();

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Keyboard className="w-6 h-6 mr-2 text-green-400" />
            Typing Challenge
          </span>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-600 text-white">
              Level {level}
            </Badge>
            <div className="flex items-center text-orange-400">
              <Clock className="w-4 h-4 mr-1" />
              {timeLeft}s
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h2 className="text-white text-sm mb-2">
            Challenge {currentChallengeIndex + 1} of {challenges.length}
          </h2>
          <h3 className="text-2xl font-bold text-white mb-6">
            {currentChallenge.prompt}
          </h3>
          
          <div className="max-w-md mx-auto space-y-4">
            <Input
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              disabled={showResult || isComplete}
              className="text-center text-lg bg-gray-800 border-gray-600 text-white"
              autoFocus
            />
            
            {!showResult && (
              <Button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Submit Answer
              </Button>
            )}
          </div>
        </div>

        {showResult && (
          <div className={`
            rounded-lg p-6 text-center space-y-4
            ${isCorrect ? 'bg-green-900 border-green-500 border-2' : 'bg-red-900 border-red-500 border-2'}
          `}>
            <div className="flex items-center justify-center space-x-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-green-400 font-bold text-xl">Correct! 🎉</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                    ✕
                  </div>
                  <span className="text-red-400 font-bold text-xl">Not quite right</span>
                </>
              )}
            </div>
            
            <div className="text-white">
              {isCorrect ? (
                <div>
                  <p>You earned {currentChallenge.points + Math.floor(timeLeft / 2)} points!</p>
                  <p className="text-sm text-gray-300">
                    ({currentChallenge.points} base + {Math.floor(timeLeft / 2)} time bonus)
                  </p>
                </div>
              ) : (
                <p>The correct answer was: <span className="font-bold">{currentChallenge.answer}</span></p>
              )}
            </div>
            
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {isLastChallenge ? '🎉 Complete Level!' : '➡️ Next Challenge'}
            </Button>
          </div>
        )}

        <div className="flex justify-between text-gray-400 text-sm">
          <span>Score: {score} points</span>
          <span>Correct: {correctAnswers}/{challenges.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypingGame;
