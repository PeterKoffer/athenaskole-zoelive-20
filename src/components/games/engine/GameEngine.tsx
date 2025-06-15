
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, ArrowLeft } from 'lucide-react';
import { CurriculumGame } from '../types/GameTypes';
import { useToast } from '@/hooks/use-toast';

// Game interaction components
import DragDropGame from './interactions/DragDropGame';
import ClickSequenceGame from './interactions/ClickSequenceGame';
import MultipleChoiceGame from './interactions/MultipleChoiceGame';
import TypingGame from './interactions/TypingGame';
import DrawingGame from './interactions/DrawingGame';
import SimulationGame from './interactions/SimulationGame';

interface GameEngineProps {
  game: CurriculumGame;
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  achievements: string[];
  isComplete: boolean;
  timeElapsed: number;
}

const GameEngine = ({ game, onComplete, onBack }: GameEngineProps) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    lives: 3,
    achievements: [],
    isComplete: false,
    timeElapsed: 0
  });

  const [gameStarted, setGameStarted] = useState(false);
  const maxLevels = 5;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameState.isComplete) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameState.isComplete]);

  const handleLevelComplete = (levelScore: number, perfect: boolean = false) => {
    const newScore = gameState.score + levelScore;
    const newAchievements = [...gameState.achievements];
    
    if (perfect) {
      newAchievements.push(`Perfect Level ${gameState.currentLevel}!`);
    }

    if (gameState.currentLevel >= maxLevels) {
      // Game complete
      const finalAchievements = [...newAchievements, ...game.rewards.badges];
      setGameState(prev => ({ 
        ...prev, 
        score: newScore, 
        achievements: finalAchievements,
        isComplete: true 
      }));
      
      toast({
        title: "Game Complete! 🎉",
        description: `You earned ${newScore} points and ${finalAchievements.length} achievements!`,
        duration: 5000
      });
      
      setTimeout(() => {
        onComplete(newScore, finalAchievements);
      }, 2000);
    } else {
      // Next level
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        score: newScore,
        achievements: newAchievements
      }));
      
      toast({
        title: "Level Complete!",
        description: `Moving to level ${gameState.currentLevel + 1}`,
        duration: 2000
      });
    }
  };

  const handleGameStart = () => {
    setGameStarted(true);
    toast({
      title: "Game Started!",
      description: `Good luck with ${game.title}!`,
      duration: 2000
    });
  };

  const renderGameInteraction = () => {
    const commonProps = {
      level: gameState.currentLevel,
      onLevelComplete: handleLevelComplete,
      gameData: game
    };

    switch (game.interactionType) {
      case 'drag-drop':
        return <DragDropGame {...commonProps} />;
      case 'click-sequence':
        return <ClickSequenceGame {...commonProps} />;
      case 'multiple-choice':
        return <MultipleChoiceGame {...commonProps} />;
      case 'typing':
        return <TypingGame {...commonProps} />;
      case 'drawing':
        return <DrawingGame {...commonProps} />;
      case 'simulation':
        return <SimulationGame {...commonProps} />;
      default:
        return <MultipleChoiceGame {...commonProps} />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState.isComplete) {
    return (
      <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-500 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-white">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            🎉 GAME COMPLETE! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl">{game.emoji}</div>
          <h2 className="text-2xl font-bold text-white">{game.title}</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
              <div className="text-green-200">Points Earned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{gameState.achievements.length}</div>
              <div className="text-green-200">Achievements</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{formatTime(gameState.timeElapsed)}</div>
              <div className="text-green-200">Time Played</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Achievements Unlocked:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {gameState.achievements.map((achievement, index) => (
                <Badge key={index} className="bg-yellow-500 text-black">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:text-lime-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge className={`
              ${game.difficulty === 'beginner' ? 'bg-green-500' : 
                game.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'}
              text-white
            `}>
              {game.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-white text-center">
            <div className="text-6xl mb-4">{game.emoji}</div>
            {game.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300 text-center text-lg">{game.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Learning Objectives:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                {game.learningObjectives.map((objective, index) => (
                  <li key={index}>• {objective}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Game Info:</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <div>⏱️ Time: {game.timeEstimate}</div>
                <div>🎯 Grade: {game.gradeLevel.join(', ')}</div>
                <div>⭐ Coins: {game.rewards.coins}</div>
                <div>🏆 Levels: {maxLevels}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleGameStart}
              size="lg"
              className="bg-lime-500 hover:bg-lime-600 text-black font-bold px-8 py-4 text-xl"
            >
              🎮 START GAME
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Game Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:text-lime-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
              <div className="text-2xl">{game.emoji}</div>
              <div>
                <h2 className="text-white font-bold">{game.title}</h2>
                <p className="text-gray-400 text-sm">Level {gameState.currentLevel} of {maxLevels}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-yellow-400 font-bold">⭐ {gameState.score}</div>
                <div className="text-gray-400 text-sm">Score</div>
              </div>
              <div className="text-right">
                <div className="text-red-400 font-bold">❤️ {gameState.lives}</div>
                <div className="text-gray-400 text-sm">Lives</div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold">{formatTime(gameState.timeElapsed)}</div>
                <div className="text-gray-400 text-sm">Time</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress 
              value={(gameState.currentLevel / maxLevels) * 100} 
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Game Content */}
      <div>
        {renderGameInteraction()}
      </div>
    </div>
  );
};

export default GameEngine;
