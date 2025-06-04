
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getGamesBySubject, CurriculumGame } from '../../games/CurriculumGameConfig';

interface CSModeManagerProps {
  children: (props: {
    selectedGame: string | null;
    selectedMode: string;
    csGames: CurriculumGame[];
    performanceMetrics: {
      accuracy: number;
      averageTime: number;
      consecutiveCorrect: number;
      consecutiveIncorrect: number;
      totalAttempts: number;
    };
    handleModeChange: (mode: any) => void;
    handleGameSelect: (gameId: string) => void;
    handleDifficultyChange: (newLevel: number, reason: string) => void;
  }) => React.ReactNode;
}

const CSModeManager = ({ children }: CSModeManagerProps) => {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('games');
  const [csGames, setCsGames] = useState<CurriculumGame[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 75,
    averageTime: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    totalAttempts: 0
  });
  
  useEffect(() => {
    // Get Computer Science games
    const games = getGamesBySubject("Computer Science");
    setCsGames(games);
  }, []);

  const handleModeChange = (mode: any) => {
    setSelectedMode(mode.id);
    
    toast({
      title: `Switched to ${mode.name}`,
      description: mode.description,
      duration: 3000
    });
  };

  const handleGameSelect = (gameId: string) => {
    console.log("Selected game:", gameId);
    setSelectedGame(gameId);
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    toast({
      title: `Difficulty Adjusted to Level ${newLevel}`,
      description: reason,
      duration: 3000
    });
  };

  return (
    <>
      {children({
        selectedGame,
        selectedMode,
        csGames,
        performanceMetrics,
        handleModeChange,
        handleGameSelect,
        handleDifficultyChange
      })}
    </>
  );
};

export default CSModeManager;
