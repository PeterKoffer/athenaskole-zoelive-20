
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Target, Star } from 'lucide-react';
import GameEngine, { GameState, GameActions } from './GameEngine';
import { getGameById, CurriculumGame } from './CurriculumGameConfig';

interface SampleGameProps {
  gameId: string;
  onBack: () => void;
  onComplete: (score: number, achievements: string[]) => void;
}

const SampleGame = ({ gameId, onBack, onComplete }: SampleGameProps) => {
  const gameConfig = getGameById(gameId);
  
  if (!gameConfig) {
    return <div className="text-center p-10">Game not found</div>;
  }

  // Convert curriculum game to game engine config
  const engineConfig = {
    id: gameConfig.id,
    title: gameConfig.title,
    subject: gameConfig.subject,
    interactionType: gameConfig.interactionType,
    difficulty: gameConfig.gradeLevel[0] || 1, // Use first grade level as initial difficulty
    gradeLevel: gameConfig.gradeLevel,
    objectives: gameConfig.learningObjectives,
    maxScore: 1000,
    timeLimit: 300, // 5 minutes
    adaptiveRules: gameConfig.adaptiveRules || {
      successThreshold: 75,
      failureThreshold: 35,
      difficultyIncrease: 1,
      difficultyDecrease: 1
    }
  };

  const GameContent = ({ gameState, gameActions }: { gameState: GameState; gameActions: GameActions }) => {
    const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
    const [targets, setTargets] = useState<{id: number; x: number; y: number; clicked: boolean}[]>([]);
    const [nextId, setNextId] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(30);

    useEffect(() => {
      // Generate random targets
      const newTargets = [];
      for (let i = 0; i < 5; i++) {
        newTargets.push({
          id: i + 1,
          x: Math.random() * 80 + 10, // 10-90%
          y: Math.random() * 80 + 10, // 10-90%
          clicked: false
        });
      }
      setTargets(newTargets);
      setNextId(6);
      
      // Set up countdown timer
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            checkGameEnd();
          }
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }, [gameState.level]); // Reset when level changes
    
    const handleTargetClick = (id: number) => {
      // Update the target to clicked
      setTargets(prev => prev.map(t => t.id === id ? {...t, clicked: true} : t));
      
      // Update score
      gameActions.updateScore(100);
      
      // Check if clicked all targets
      const updatedTargets = targets.map(t => t.id === id ? {...t, clicked: true} : t);
      const allClicked = updatedTargets.every(t => t.clicked);
      
      if (allClicked) {
        // Generate new level with more targets
        const newTargets = [];
        for (let i = 0; i < 5 + gameState.level; i++) {
          newTargets.push({
            id: nextId + i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            clicked: false
          });
        }
        
        setTargets(newTargets);
        setNextId(nextId + 5 + gameState.level);
        setTimeRemaining(30);
        
        // Add achievement for completing a level
        gameActions.addAchievement(`Completed Level ${gameState.level}`);
        
        // Advance level and adjust difficulty based on performance
        const performance = gameState.score / (gameState.level * 500) * 100;
        gameActions.adaptDifficulty(performance);
      }
    };
    
    const checkGameEnd = () => {
      // Check if time's up
      if (timeRemaining <= 0) {
        // Add final achievement
        gameActions.addAchievement(`Reached Level ${gameState.level}`);
        
        // Complete the game
        gameActions.completeGame();
      }
    };

    // Determine game type based on interactionType
    let gameUI;
    
    switch (gameConfig.interactionType) {
      case 'click-sequence':
        gameUI = (
          <div className="p-6 bg-gray-800 rounded-lg min-h-[400px] relative">
            <div className="flex justify-between mb-4">
              <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                <Target className="w-3 h-3 mr-1" />
                Level {gameState.level}
              </Badge>
              <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
                <Timer className="w-3 h-3 mr-1" />
                {timeRemaining}s remaining
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white">Click on all targets!</h3>
              <p className="text-gray-400 text-sm">Click on each target before time runs out</p>
            </div>
            
            <div className="relative bg-gray-700 rounded-lg w-full h-[300px]">
              {targets.map((target) => (
                <div 
                  key={target.id}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${target.clicked ? 'bg-green-600 opacity-50' : 'bg-red-500 hover:bg-red-400 cursor-pointer'}`}
                  style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => !target.clicked && handleTargetClick(target.id)}
                >
                  <Star className={`w-5 h-5 ${target.clicked ? 'text-green-200' : 'text-white'}`} />
                </div>
              ))}
            </div>
          </div>
        );
        break;
        
      case 'multiple-choice':
        // Simplified multiple choice demo
        gameUI = (
          <div className="p-6 bg-gray-800 rounded-lg min-h-[400px]">
            <div className="flex justify-between mb-4">
              <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
                <Target className="w-3 h-3 mr-1" />
                Level {gameState.level}
              </Badge>
              <Badge variant="outline" className="bg-red-900 text-red-400 border-red-400">
                <Timer className="w-3 h-3 mr-1" />
                {timeRemaining}s remaining
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white">Choose the correct answer!</h3>
              <p className="text-gray-400 text-sm">Select the best answer to the question</p>
            </div>
            
            <Card className="bg-gray-700 border-gray-600 mb-6">
              <CardContent className="p-6">
                <p className="text-white text-lg">
                  What is the main subject of this game?
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                gameConfig.subject,
                "Physical Education",
                "Art",
                "Language Arts"
              ].map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left p-4 h-auto bg-gray-700 hover:bg-gray-600 border-gray-600"
                  onClick={() => {
                    if (option === gameConfig.subject) {
                      gameActions.updateScore(100);
                      gameActions.addAchievement("Correct Answer!");
                      setTimeRemaining(30);
                      const performance = gameState.score / (gameState.level * 500) * 100;
                      gameActions.adaptDifficulty(performance);
                    } else {
                      gameActions.loseLife();
                    }
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );
        break;
        
      default:
        gameUI = (
          <div className="p-6 bg-gray-800 rounded-lg min-h-[400px] text-center">
            <p className="text-white">
              Interactive {gameConfig.interactionType} game interface would appear here.
            </p>
            <div className="mt-6 space-y-4">
              <Button 
                onClick={() => gameActions.updateScore(100)}
                className="w-full"
              >
                Add 100 points
              </Button>
              <Button 
                onClick={() => gameActions.addAchievement("Explorer Badge")}
                variant="outline"
                className="w-full"
              >
                Unlock Achievement
              </Button>
              <Button 
                onClick={() => gameActions.completeGame()}
                variant="destructive"
                className="w-full"
              >
                Complete Game
              </Button>
            </div>
          </div>
        );
    }

    return gameUI;
  };

  return (
    <GameEngine
      gameConfig={engineConfig}
      onComplete={onComplete}
      onBack={onBack}
    >
      {(gameState, gameActions) => (
        <GameContent gameState={gameState} gameActions={gameActions} />
      )}
    </GameEngine>
  );
};

export default SampleGame;
