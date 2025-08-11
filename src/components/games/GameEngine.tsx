
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTimerManager } from '../education/hooks/useTimerManager';
import { useGameStateManager } from './hooks/useGameStateManager';
import { useGameTracking } from '@/hooks/useGameTracking';
import { GameHeader } from './components/GameHeader';

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
  assignmentId?: string; // Optional assignment ID for tracking
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
  // Enhanced tracking actions
  recordAction: () => void;
  recordHintUsed: () => void;
  recordAttempt: () => void;
}

const GameEngine = ({ gameConfig, assignmentId, onComplete, onBack, children }: GameEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Enhanced game tracking
  const {
    isTracking,
    recordAction,
    recordHintUsed,
    recordAttempt,
    updateLearningOutcome,
    startGameTracking,
    endGameTracking,
    abandonGameTracking
  } = useGameTracking(gameConfig.id, assignmentId);
  
  // Timer management
  const { 
    timeElapsed, 
    stopTimer
  } = useTimerManager({ 
    autoStart: true,
    onTick: (time) => updateTimeElapsed(time)
  });

  // Game state management
  const {
    gameState,
    updateScore,
    updateTimeElapsed,
    completeObjective: completeObjectiveBase,
    loseLife: loseLifeBase,
    addAchievement: addAchievementBase,
    updateGameData,
    completeGame: completeGameBase,
    adaptDifficulty: adaptDifficultyBase,
    getScorePercentage
  } = useGameStateManager({
    initialLevel: gameConfig.difficulty,
    objectives: gameConfig.objectives,
    maxScore: gameConfig.maxScore
  });

  // Initialize tracking when game starts
  useEffect(() => {
    if (user && !isTracking) {
      startGameTracking(gameConfig.subject, gameConfig.objectives[0]);
    }
  }, [user, gameConfig, startGameTracking, isTracking]);

  // Auto-complete on time limit
  useEffect(() => {
    if (gameConfig.timeLimit && timeElapsed >= gameConfig.timeLimit) {
      completeGame();
    }
  }, [timeElapsed, gameConfig.timeLimit]);

  const completeObjective = useCallback((objective: string) => {
    recordAction(); // Track the action
    updateLearningOutcome(objective, true, 100); // Mark objective as achieved
    
    const shouldComplete = completeObjectiveBase(objective);
    if (shouldComplete) {
      completeGame();
    }
  }, [completeObjectiveBase, recordAction, updateLearningOutcome]);

  const loseLife = useCallback(() => {
    recordAttempt(); // Track the failed attempt
    loseLifeBase();
    if (gameState.lives <= 1) { // Will be 0 after loseLifeBase
      completeGame();
    }
  }, [loseLifeBase, gameState.lives, recordAttempt]);

  const addAchievement = useCallback((achievement: string) => {
    recordAction(); // Track achievement action
    addAchievementBase(achievement);
    
    toast({
      title: "Achievement Unlocked! 🏆",
      description: achievement,
      duration: 3000
    });
  }, [addAchievementBase, toast, recordAction]);

  const adaptDifficulty = useCallback((performance: number) => {
    const { successThreshold, failureThreshold, difficultyIncrease, difficultyDecrease } = gameConfig.adaptiveRules;
    
    let newLevel = gameState.level;
    
    if (performance >= successThreshold) {
      newLevel = Math.min(10, gameState.level + difficultyIncrease);
      toast({
        title: "Difficulty Increased! 📈",
        description: `Great performance! Moving to level ${newLevel}`,
        duration: 2000
      });
    } else if (performance <= failureThreshold) {
      newLevel = Math.max(1, gameState.level - difficultyDecrease);
      toast({
        title: "Difficulty Adjusted 📉",
        description: `No worries! Moving to level ${newLevel}`,
        duration: 2000
      });
    }
    
    adaptDifficultyBase(newLevel);
  }, [gameConfig.adaptiveRules, gameState.level, toast, adaptDifficultyBase]);

  const completeGame = useCallback(async () => {
    completeGameBase();
    stopTimer();
    
    // End tracking with detailed outcomes
    if (isTracking) {
      const completedObjectives = gameConfig.objectives.map(obj => ({
        objectiveId: obj,
        description: obj,
        achieved: gameState.achievements.includes(obj),
        confidenceLevel: gameState.achievements.includes(obj) ? 100 : 0
      }));
      
      await endGameTracking(gameState.score, completedObjectives);
    }
    
    onComplete(gameState.score, gameState.achievements);
  }, [completeGameBase, stopTimer, endGameTracking, gameState.score, gameState.achievements, gameConfig.objectives, isTracking, onComplete]);

  const gameActions: GameActions = {
    updateScore: (points: number) => {
      recordAction(); // Track score update action
      updateScore(points);
    },
    completeObjective,
    loseLife,
    addAchievement,
    updateGameData,
    completeGame,
    adaptDifficulty,
    // Enhanced tracking actions
    recordAction,
    recordHintUsed,
    recordAttempt
  };

  // Handle navigation away from game
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTracking) {
        abandonGameTracking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTracking, abandonGameTracking]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <GameHeader 
        gameConfig={gameConfig}
        gameState={gameState}
        scorePercentage={getScorePercentage()}
        onBack={onBack}
      />

      {/* Game Content */}
      <div className="min-h-[500px]">
        {children(gameState, gameActions)}
      </div>
    </div>
  );
};

export default GameEngine;
