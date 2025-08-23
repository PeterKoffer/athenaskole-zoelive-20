
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getGameById } from './CurriculumGameConfig';
import GameEngine from './engine/GameEngine';
import { useToast } from '@/hooks/use-toast';
import { loadAllGamesData } from './data/GameData';

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
        
        console.log('🔍 Looking for game with ID:', gameId);
        
        // First, try to find the game in current data
        let foundGame = getGameById(gameId);
        console.log('📋 Found in current data:', foundGame?.title || 'Not found');
        
        if (!foundGame) {
          // Load all games from external sources
          console.log('🌐 Loading all games from external sources...');
          const allGames = await loadAllGamesData();
          console.log('📊 Loaded games:', allGames.length, 'total games');
          
          // Search in loaded games
          foundGame = allGames.find(g => g.id === gameId);
          console.log('🎯 Found in external data:', foundGame?.title || 'Not found');
          
          // If still not found, try partial matching for debugging
          if (!foundGame) {
            const similarGames = allGames.filter(g => 
              g.id.includes('geography') || 
              g.title.toLowerCase().includes('geography') ||
              g.subject.toLowerCase().includes('geography')
            );
            console.log('🗺️ Geography-related games found:', similarGames.map(g => ({ id: g.id, title: g.title })));
            
            // Use the first geography game if available
            if (similarGames.length > 0) {
              foundGame = similarGames[0];
              console.log('✅ Using geography game:', foundGame.title);
            }
          }
        }
        
        if (!foundGame) {
          console.error('❌ Game not found:', gameId);
          setError(`Game not found: ${gameId}`);
          return;
        }
        
        console.log('🎮 Successfully loaded game:', foundGame.title, '- Subject:', foundGame.subject);
        setGame(foundGame);
        
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
