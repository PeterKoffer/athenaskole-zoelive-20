
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { curriculumGames, getGameById } from './CurriculumGameConfig';
import GameEngine from './engine/GameEngine';
import { useToast } from '@/hooks/use-toast';

interface SampleGameProps {
  gameId: string;
  onBack: () => void;
  onComplete: (score: number, achievements: string[]) => void;
}

const SampleGame = ({ gameId, onBack, onComplete }: SampleGameProps) => {
  const [game, setGame] = useState(getGameById(gameId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to find the game in current data
        let foundGame = getGameById(gameId);
        
        if (!foundGame) {
          // Try to load from external data
          const response = await fetch('/data/games/mathematics-k12-games.json');
          if (response.ok) {
            const games = await response.json();
            foundGame = games.find((g: any) => g.id === gameId);
          }
        }
        
        if (!foundGame) {
          // Fallback: create a simple game
          foundGame = {
            id: gameId,
            title: "Math Adventure",
            description: "A fun math learning experience!",
            emoji: "🎯",
            subject: "Mathematics",
            gradeLevel: [1, 2, 3],
            difficulty: "beginner" as const,
            interactionType: "multiple-choice" as const,
            timeEstimate: "15-20 min",
            skillAreas: ["basic_math", "problem_solving"],
            learningObjectives: ["Practice basic math", "Develop problem-solving skills"],
            status: "available" as const,
            rewards: {
              coins: 150,
              badges: ["Math Explorer", "Problem Solver"]
            }
          };
        }
        
        setGame(foundGame);
        console.log('🎮 Loaded game:', foundGame);
        
      } catch (err) {
        console.error('🚫 Error loading game:', err);
        setError(`Failed to load game: ${gameId}`);
        toast({
          title: "Game Loading Error",
          description: "Failed to load the selected game. Please try another game.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, toast]);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Loading Game...</h3>
          <p className="text-gray-400">Preparing your educational adventure!</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !game) {
    return (
      <Card className="bg-red-900 border-red-700 max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Game Not Found</h3>
          <p className="text-red-300 mb-4">
            {error || `Could not find game with ID: ${gameId}`}
          </p>
          <Button 
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <GameEngine
      game={game}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
};

export default SampleGame;
