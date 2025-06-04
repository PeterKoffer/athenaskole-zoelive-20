
import { useState, useEffect } from 'react';
import LearningHeader from "@/components/education/LearningHeader";
import { getGamesBySubject, CurriculumGame } from '../games/CurriculumGameConfig';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CSAdaptiveView from './computer-science/CSAdaptiveView';
import CSLearningHeader from './computer-science/CSLearningHeader';
import CSSkillAreasGrid from './computer-science/CSSkillAreasGrid';
import CSFeaturedGames from './computer-science/CSFeaturedGames';
import CSLearningJourney from './computer-science/CSLearningJourney';

const ComputerScienceLearning = () => {
  const { user } = useAuth();
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

  if (selectedMode === 'adaptive') {
    return (
      <CSAdaptiveView 
        onModeChange={handleModeChange}
        selectedMode={selectedMode}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <LearningHeader 
        title="Computer Science & AI Learning"
        backTo="/daily-program"
        backLabel="Back to Program"
        onModeChange={handleModeChange}
        currentMode={selectedMode}
      />
      
      <div className="p-6">
        <CSLearningHeader
          performanceMetrics={performanceMetrics}
          onDifficultyChange={handleDifficultyChange}
        />
        
        <CSSkillAreasGrid />
        
        <CSFeaturedGames onGameSelect={handleGameSelect} />
        
        <CSLearningJourney />
      </div>
    </div>
  );
};

export default ComputerScienceLearning;
