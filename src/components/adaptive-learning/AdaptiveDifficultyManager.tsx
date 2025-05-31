
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  totalAttempts: number;
}

interface DifficultyLevel {
  level: number;
  name: string;
  color: string;
  icon: JSX.Element;
}

interface AdaptiveDifficultyManagerProps {
  currentDifficulty: number;
  onDifficultyChange: (newLevel: number, reason: string) => void;
  performanceMetrics: PerformanceMetrics;
}

const AdaptiveDifficultyManager = ({ 
  currentDifficulty, 
  onDifficultyChange, 
  performanceMetrics 
}: AdaptiveDifficultyManagerProps) => {
  const [lastAdjustment, setLastAdjustment] = useState<string>('');

  const difficultyLevels: DifficultyLevel[] = [
    { level: 1, name: "Beginner", color: "bg-green-500", icon: <Target className="w-3 h-3" /> },
    { level: 2, name: "Easy", color: "bg-blue-500", icon: <Target className="w-3 h-3" /> },
    { level: 3, name: "Medium", color: "bg-yellow-500", icon: <Target className="w-3 h-3" /> },
    { level: 4, name: "Hard", color: "bg-orange-500", icon: <Target className="w-3 h-3" /> },
    { level: 5, name: "Expert", color: "bg-red-500", icon: <Target className="w-3 h-3" /> }
  ];

  useEffect(() => {
    // Check if difficulty should be adjusted based on performance
    const shouldAdjust = analyzePerfomance();
    if (shouldAdjust) {
      adjustDifficulty();
    }
  }, [performanceMetrics]);

  const analyzePerfomance = (): boolean => {
    const { accuracy, consecutiveCorrect, consecutiveIncorrect, totalAttempts } = performanceMetrics;
    
    // Don't adjust until we have enough data
    if (totalAttempts < 3) return false;

    // Increase difficulty conditions
    if (accuracy >= 85 && consecutiveCorrect >= 3) return true;
    if (accuracy >= 90 && consecutiveCorrect >= 2) return true;

    // Decrease difficulty conditions
    if (accuracy <= 50 && consecutiveIncorrect >= 2) return true;
    if (accuracy <= 30) return true;

    return false;
  };

  const adjustDifficulty = () => {
    const { accuracy, consecutiveCorrect, consecutiveIncorrect } = performanceMetrics;
    let newLevel = currentDifficulty;
    let reason = '';

    // Increase difficulty
    if (accuracy >= 85 && consecutiveCorrect >= 3 && currentDifficulty < 5) {
      newLevel = Math.min(currentDifficulty + 1, 5);
      reason = `High accuracy (${accuracy.toFixed(1)}%) - increasing difficulty`;
    }
    // Decrease difficulty
    else if ((accuracy <= 50 && consecutiveIncorrect >= 2) || accuracy <= 30) {
      if (currentDifficulty > 1) {
        newLevel = Math.max(currentDifficulty - 1, 1);
        reason = `Low accuracy (${accuracy.toFixed(1)}%) - decreasing difficulty`;
      }
    }

    if (newLevel !== currentDifficulty) {
      setLastAdjustment(reason);
      onDifficultyChange(newLevel, reason);
    }
  };

  const getCurrentLevel = (): DifficultyLevel => {
    return difficultyLevels.find(level => level.level === currentDifficulty) || difficultyLevels[0];
  };

  const getAdjustmentIcon = () => {
    if (!lastAdjustment) return null;
    if (lastAdjustment.includes('increasing')) {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
    if (lastAdjustment.includes('decreasing')) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant="outline" 
        className={`${currentLevel.color} text-white border-transparent`}
      >
        <span className="flex items-center space-x-1">
          {currentLevel.icon}
          <span>{currentLevel.name}</span>
        </span>
      </Badge>
      
      {lastAdjustment && (
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          {getAdjustmentIcon()}
          <span className="max-w-[150px] truncate" title={lastAdjustment}>
            {lastAdjustment}
          </span>
        </div>
      )}
      
      <div className="text-xs text-gray-400">
        {performanceMetrics.accuracy.toFixed(1)}% accuracy
      </div>
    </div>
  );
};

export default AdaptiveDifficultyManager;
