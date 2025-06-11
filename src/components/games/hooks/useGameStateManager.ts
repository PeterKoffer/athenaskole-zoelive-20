
import { useState, useCallback } from 'react';

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

interface UseGameStateManagerProps {
  initialLevel: number;
  objectives: string[];
  maxScore: number;
}

export const useGameStateManager = ({
  initialLevel,
  objectives,
  maxScore
}: UseGameStateManagerProps) => {
  const [gameState, setGameState] = useState<GameState>({
    level: initialLevel,
    score: 0,
    lives: 3,
    timeElapsed: 0,
    currentObjective: objectives[0] || '',
    gameData: {},
    isComplete: false,
    achievements: []
  });

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score + points)
    }));
  }, []);

  const updateTimeElapsed = useCallback((time: number) => {
    setGameState(prev => ({
      ...prev,
      timeElapsed: time
    }));
  }, []);

  const completeObjective = useCallback((objective: string) => {
    const nextIndex = objectives.indexOf(objective) + 1;
    const nextObjective = objectives[nextIndex];
    
    setGameState(prev => ({
      ...prev,
      currentObjective: nextObjective || 'Complete!',
      score: prev.score + 50
    }));

    return !nextObjective; // Return true if game should complete
  }, [objectives]);

  const loseLife = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      return { ...prev, lives: newLives };
    });
  }, []);

  const addAchievement = useCallback((achievement: string) => {
    setGameState(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement]
    }));
  }, []);

  const updateGameData = useCallback((data: any) => {
    setGameState(prev => ({
      ...prev,
      gameData: { ...prev.gameData, ...data }
    }));
  }, []);

  const completeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isComplete: true }));
  }, []);

  const adaptDifficulty = useCallback((newLevel: number) => {
    setGameState(prev => ({ ...prev, level: newLevel }));
  }, []);

  const getScorePercentage = useCallback(() => {
    return Math.min(100, (gameState.score / maxScore) * 100);
  }, [gameState.score, maxScore]);

  return {
    gameState,
    updateScore,
    updateTimeElapsed,
    completeObjective,
    loseLife,
    addAchievement,
    updateGameData,
    completeGame,
    adaptDifficulty,
    getScorePercentage
  };
};
