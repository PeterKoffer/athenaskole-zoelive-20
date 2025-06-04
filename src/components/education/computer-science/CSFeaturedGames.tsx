
import { Star } from "lucide-react";
import CurriculumGameSelector from '@/components/games/CurriculumGameSelector';

interface CSFeaturedGamesProps {
  onGameSelect: (gameId: string) => void;
}

const CSFeaturedGames = ({ onGameSelect }: CSFeaturedGamesProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Featured Computer Science Games</h3>
      </div>
      
      <CurriculumGameSelector 
        onGameSelect={onGameSelect}
        userGradeLevel={6}
        preferredSubject="Computer Science"
      />
    </div>
  );
};

export default CSFeaturedGames;
