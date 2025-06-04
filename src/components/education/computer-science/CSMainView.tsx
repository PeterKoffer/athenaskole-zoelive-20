
import CSLearningHeader from './CSLearningHeader';
import CSSkillAreasGrid from './CSSkillAreasGrid';
import CSFeaturedGames from './CSFeaturedGames';
import CSLearningJourney from './CSLearningJourney';

interface CSMainViewProps {
  performanceMetrics: {
    accuracy: number;
    averageTime: number;
    consecutiveCorrect: number;
    consecutiveIncorrect: number;
    totalAttempts: number;
  };
  onGameSelect: (gameId: string) => void;
  onDifficultyChange: (newLevel: number, reason: string) => void;
}

const CSMainView = ({ performanceMetrics, onGameSelect, onDifficultyChange }: CSMainViewProps) => {
  return (
    <div className="p-6">
      <CSLearningHeader
        performanceMetrics={performanceMetrics}
        onDifficultyChange={onDifficultyChange}
      />
      
      <CSSkillAreasGrid />
      
      <CSFeaturedGames onGameSelect={onGameSelect} />
      
      <CSLearningJourney />
    </div>
  );
};

export default CSMainView;
