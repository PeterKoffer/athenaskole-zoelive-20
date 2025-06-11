
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Brain, ArrowLeft } from 'lucide-react';
import EnhancedLessonManager from '../components/EnhancedLessonManager';

const CSFeaturedGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const featuredGames = [
    {
      id: 'coding-basics',
      title: 'Coding Fundamentals',
      description: 'Learn the building blocks of programming with interactive exercises',
      icon: Code,
      difficulty: 'Beginner',
      duration: '15-20 min',
      color: 'from-blue-500 to-cyan-500',
      skillArea: 'programming-basics'
    },
    {
      id: 'algorithm-adventure',
      title: 'Algorithm Adventure',
      description: 'Solve puzzles using computational thinking and logic',
      icon: Brain,
      difficulty: 'Intermediate',
      duration: '20-25 min',
      color: 'from-purple-500 to-pink-500',
      skillArea: 'algorithms'
    },
    {
      id: 'ai-exploration',
      title: 'AI & Machine Learning Basics',
      description: 'Discover how artificial intelligence works through hands-on activities',
      icon: Zap,
      difficulty: 'Advanced',
      duration: '25-30 min',
      color: 'from-orange-500 to-red-500',
      skillArea: 'artificial-intelligence'
    }
  ];

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  // Show lesson if game is selected
  if (selectedGame) {
    const game = featuredGames.find(g => g.id === selectedGame);
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToGames}
            className="text-white hover:text-lime-400 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>
        <EnhancedLessonManager
          subject="computer-science"
          skillArea={game?.skillArea || 'programming-basics'}
          onBackToProgram={handleBackToGames}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Featured Computer Science Games</h2>
        <p className="text-gray-400">
          Explore computational thinking through interactive coding challenges and AI adventures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredGames.map((game) => {
          const IconComponent = game.icon;
          
          return (
            <Card key={game.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${game.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white">{game.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{game.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    {game.difficulty}
                  </Badge>
                  <span className="text-gray-400 text-sm">{game.duration}</span>
                </div>
                
                <Button 
                  onClick={() => setSelectedGame(game.id)}
                  className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white`}
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CSFeaturedGames;
