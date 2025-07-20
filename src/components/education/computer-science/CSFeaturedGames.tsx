
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Brain, ArrowLeft, Gamepad2, Trophy, Clock } from 'lucide-react';
import EnhancedLessonManager from '../components/EnhancedLessonManager';

interface CSFeaturedGamesProps {
  onGameSelect?: (gameId: string) => void;
}

const CSFeaturedGames = ({ onGameSelect }: CSFeaturedGamesProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const featuredGames = [
    {
      id: 'coding-basics',
      title: 'Code Quest: Programming Fundamentals',
      description: 'Embark on an epic coding adventure! Learn variables, loops, and functions through interactive story-driven challenges.',
      icon: Code,
      difficulty: 'Beginner',
      duration: '~15 min',
      color: 'from-blue-500 to-cyan-500',
      skillArea: 'programming-basics',
      features: ['Interactive Code Editor', 'Visual Programming', 'Real-time Feedback'],
      xpReward: 250,
      achievements: ['Code Warrior', 'Logic Master']
    },
    {
      id: 'algorithm-adventure',
      title: 'Algorithm Arena: Problem Solving',
      description: 'Battle through algorithmic challenges! Master sorting, searching, and optimization through gamified puzzle solving.',
      icon: Brain,
      difficulty: 'Intermediate',
      duration: '~25 min',
      color: 'from-purple-500 to-pink-500',
      skillArea: 'algorithms',
      features: ['Algorithm Visualization', 'Complexity Analysis', 'Strategy Games'],
      xpReward: 350,
      achievements: ['Algorithm Architect', 'Efficiency Expert']
    },
    {
      id: 'ai-exploration',
      title: 'AI Laboratory: Machine Learning Mastery',
      description: 'Discover the future of technology! Build neural networks, train models, and create intelligent systems through hands-on experiments.',
      icon: Zap,
      difficulty: 'Advanced',
      duration: '25-30 min',
      color: 'from-orange-500 to-red-500',
      skillArea: 'artificial-intelligence',
      features: ['Neural Network Builder', 'Data Visualization', 'Model Training'],
      xpReward: 500,
      achievements: ['AI Pioneer', 'Data Scientist']
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    onGameSelect?.(gameId);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          🎮 Epic Computer Science Adventures
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Master programming and computational thinking through immersive, game-based learning experiences. 
          Each adventure combines cutting-edge education with engaging gameplay.
        </p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredGames.map((game) => {
          const IconComponent = game.icon;
          
          return (
            <Card key={game.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 group hover:scale-105">
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${game.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {game.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-white text-xl mb-2">{game.title}</CardTitle>
                <p className="text-gray-300 text-sm leading-relaxed">{game.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {game.duration}
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Trophy className="w-4 h-4 mr-2" />
                    {game.xpReward} XP
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm">🚀 Game Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm">🏆 Unlock Achievements:</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleGameSelect(game.id)}
                  className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white font-semibold py-3`}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Start Adventure
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-3">🎯 Adaptive Learning Technology</h3>
        <p className="text-gray-300">
          Our AI continuously adapts difficulty, provides personalized hints, and creates custom challenges 
          based on your progress and interests. Every student gets a unique learning journey!
        </p>
      </div>
    </div>
  );
};

export default CSFeaturedGames;
