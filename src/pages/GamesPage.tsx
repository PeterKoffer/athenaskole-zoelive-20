import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Trophy, Clock, Target } from 'lucide-react';
import { getAvailableGames } from '@/games/registry';

const gameMetadata: Record<string, { 
  title: string; 
  description: string; 
  subject: string; 
  estimatedTime: string;
  difficulty: string;
}> = {
  'fast-facts': {
    title: 'Fast Facts Free Throws',
    description: 'Race against time to solve math problems and score points! Test your arithmetic skills in this basketball-themed math sprint.',
    subject: 'Mathematics',
    estimatedTime: '90 seconds',
    difficulty: 'Easy to Medium'
  }
};

export default function GamesPage() {
  const navigate = useNavigate();
  const [availableGames, setAvailableGames] = useState<string[]>([]);

  useEffect(() => {
    setAvailableGames(getAvailableGames());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Learning Games</h1>
            <p className="text-muted-foreground mt-2">
              Play educational games and compete with students worldwide
            </p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGames.map(gameId => {
            const meta = gameMetadata[gameId];
            if (!meta) return null;

            return (
              <Card key={gameId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{meta.title}</span>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {meta.subject}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {meta.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meta.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {meta.difficulty}
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate(`/games/${gameId}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {availableGames.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No games available at the moment.
              </div>
              <div className="text-sm text-muted-foreground">
                Check back soon for new educational games!
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coming Soon */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Budget Cafe Challenge',
                subject: 'Mathematics & Business',
                description: 'Manage a virtual cafe, handle budgets, and learn business math concepts.',
                estimatedTime: '5-10 minutes'
              },
              {
                title: 'Science Lab Simulator',
                subject: 'Science',
                description: 'Conduct virtual experiments and learn scientific principles safely.',
                estimatedTime: '10-15 minutes'
              },
              {
                title: 'Word Builder Arena',
                subject: 'Language Arts',
                description: 'Build words and compete in spelling and vocabulary challenges.',
                estimatedTime: '3-5 minutes'
              }
            ].map((game, index) => (
              <Card key={index} className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{game.title}</span>
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Coming Soon
                    </div>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {game.subject}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {game.estimatedTime}
                  </div>

                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}