
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface GameState {
  level: number;
  score: number;
  lives: number;
  timeElapsed: number;
  currentObjective: string;
  gameData: any;
  isComplete: boolean;
  achievements: string[];
}

export interface GameConfig {
  id: string;
  title: string;
  subject: string;
  interactionType: 'drag-drop' | 'click-sequence' | 'drawing' | 'typing' | 'multiple-choice' | 'simulation' | 'puzzle' | 'memory' | 'timing' | 'strategy';
  difficulty: number;
  gradeLevel: number[];
  objectives: string[];
  maxScore: number;
  timeLimit?: number;
  adaptiveRules: {
    successThreshold: number;
    failureThreshold: number;
    difficultyIncrease: number;
    difficultyDecrease: number;
  };
}

interface GameEngineProps {
  gameConfig: GameConfig;
  onComplete: (finalScore: number, achievements: string[]) => void;
  onBack: () => void;
  children: (gameState: GameState, gameActions: GameActions) => React.ReactNode;
}

export interface GameActions {
  updateScore: (points: number) => void;
  completeObjective: (objective: string) => void;
  loseLife: () => void;
  addAchievement: (achievement: string) => void;
  updateGameData: (data: any) => void;
  completeGame: () => void;
  adaptDifficulty: (performance: number) => void;
}

const GameEngine = ({ gameConfig, onComplete, onBack, children }: GameEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    level: gameConfig.difficulty,
    score: 0,
    lives: 3,
    timeElapsed: 0,
    currentObjective: gameConfig.objectives[0] || '',
    gameData: {},
    isComplete: false,
    achievements: []
  });

  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (isPaused || gameState.isComplete) return;

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isPaused, gameState.isComplete]);

  // Auto-complete on time limit
  useEffect(() => {
    if (gameConfig.timeLimit && gameState.timeElapsed >= gameConfig.timeLimit) {
      completeGame();
    }
  }, [gameState.timeElapsed, gameConfig.timeLimit]);

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + points)
    }));
  }, []);

  const completeObjective = useCallback((objective: string) => {
    const nextIndex = gameConfig.objectives.indexOf(objective) + 1;
    const nextObjective = gameConfig.objectives[nextIndex];
    
    setGameState(prev => ({
      ...prev,
      currentObjective: nextObjective || 'Complete!',
      score: prev.score + 50
    }));

    if (!nextObjective) {
      completeGame();
    }
  }, [gameConfig.objectives]);

  const loseLife = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        completeGame();
      }
      return { ...prev, lives: newLives };
    });
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    setGameState(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement]
    }));
    
    toast({
      title: "Achievement Unlocked! 🏆",
      description: achievement,
      duration: 3000
    });
  }, [toast]);

  const updateGameData = useCallback((data: any) => {
    setGameState(prev => ({
      ...prev,
      gameData: { ...prev.gameData, ...data }
    }));
  }, []);

  const adaptDifficulty = useCallback((performance: number) => {
    const { successThreshold, failureThreshold, difficultyIncrease, difficultyDecrease } = gameConfig.adaptiveRules;
    
    setGameState(prev => {
      let newLevel = prev.level;
      
      if (performance >= successThreshold) {
        newLevel = Math.min(10, prev.level + difficultyIncrease);
        toast({
          title: "Difficulty Increased! 📈",
          description: `Great performance! Moving to level ${newLevel}`,
          duration: 2000
        });
      } else if (performance <= failureThreshold) {
        newLevel = Math.max(1, prev.level - difficultyDecrease);
        toast({
          title: "Difficulty Adjusted 📉",
          description: `No worries! Moving to level ${newLevel}`,
          duration: 2000
        });
      }
      
      return { ...prev, level: newLevel };
    });
  }, [gameConfig.adaptiveRules, toast]);

  const completeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isComplete: true }));
    onComplete(gameState.score, gameState.achievements);
  }, [gameState.score, gameState.achievements, onComplete]);

  const gameActions: GameActions = {
    updateScore,
    completeObjective,
    loseLife,
    addAchievement,
    updateGameData,
    completeGame,
    adaptDifficulty
  };

  const getScorePercentage = () => {
    return Math.min(100, (gameState.score / gameConfig.maxScore) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Game Header */}
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
                <span className="text-sm text-gray-400">{getScorePercentage().toFixed(1)}%</span>
              </div>
              <Progress value={getScorePercentage()} className="h-2" />
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

      {/* Game Content */}
      <div className="min-h-[500px]">
        {children(gameState, gameActions)}
      </div>
    </div>
  );
};

export default GameEngine;
