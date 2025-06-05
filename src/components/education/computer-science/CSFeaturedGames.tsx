
import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedLessonManager from '../components/EnhancedLessonManager';

interface CSFeaturedGamesProps {
  onGameSelect: (gameId: string) => void;
}

const featuredGames = [
  {
    id: 'robot-programming-challenge',
    title: 'Robot Programming Challenge',
    description: 'Program your robot companion to navigate mazes and solve puzzles using basic coding concepts!',
    skillArea: 'programming-basics',
    difficulty: 'beginner',
    timeEstimate: '25-30 min',
    tags: ['basic programming', 'logical thinking']
  },
  {
    id: 'algorithm-puzzle-palace',
    title: 'Algorithm Puzzle Palace',
    description: 'Solve algorithmic puzzles and optimize solutions in this strategy-based computer science adventure!',
    skillArea: 'algorithms-logic',
    difficulty: 'intermediate',
    timeEstimate: '30-35 min',
    tags: ['algorithms', 'optimization']
  },
  {
    id: 'web-design-studio',
    title: 'Web Design Studio',
    description: 'Create and design websites using HTML, CSS, and basic web development principles!',
    skillArea: 'web-development',
    difficulty: 'beginner',
    timeEstimate: '25-30 min',
    tags: ['web development', 'html', 'css']
  }
];

const CSFeaturedGames = ({ onGameSelect }: CSFeaturedGamesProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handlePlayNow = (gameId: string, skillArea: string) => {
    console.log('🎮 Starting game lesson:', gameId, 'for skill area:', skillArea);
    setSelectedGame(skillArea);
    onGameSelect(gameId);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const handleLessonComplete = () => {
    console.log('🎉 Game lesson completed!');
    setSelectedGame(null);
  };

  // If a game is selected, show the lesson
  if (selectedGame) {
    return (
      <EnhancedLessonManager
        subject="computer-science"
        skillArea={selectedGame}
        onLessonComplete={handleLessonComplete}
        onBack={handleBackToGames}
      />
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Featured Computer Science Games</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredGames.map((game) => (
          <Card key={game.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  {game.difficulty}
                </Badge>
                <span className="text-xs text-gray-400">{game.timeEstimate}</span>
              </div>
              
              <h4 className="text-white font-semibold mb-2">{game.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {game.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
                {game.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    +{game.tags.length - 2} more
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={() => handlePlayNow(game.id, game.skillArea)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CSFeaturedGames;
