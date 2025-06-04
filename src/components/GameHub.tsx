
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, AlertCircle } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";
import CurriculumGameSelector from "@/components/games/CurriculumGameSelector";
import LeaderboardCard from "@/components/games/LeaderboardCard";
import SampleGame from "@/components/games/SampleGame";
import { useToast } from "@/hooks/use-toast";

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameError, setGameError] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle game selection with error handling
  const handleGameSelect = (gameId: string) => {
    console.log("🎮 Selected game:", gameId);
    setGameError(null); // Clear any previous errors
    
    try {
      setSelectedGame(gameId);
      
      toast({
        title: "Starting Game",
        description: `Loading ${gameId}...`,
        duration: 2000
      });
    } catch (error) {
      console.error("🚫 Error starting game:", error);
      setGameError(`Failed to start game: ${gameId}`);
      toast({
        title: "Game Error",
        description: "Failed to start the selected game. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle game completion
  const handleGameComplete = (score: number, achievements: string[]) => {
    toast({
      title: "Game Completed! 🎉",
      description: `You earned ${score} points and ${achievements.length} achievements!`,
      duration: 5000
    });
    
    // Return to game selection screen
    setSelectedGame(null);
    setGameError(null);
  };

  // Handle game back navigation
  const handleGameBack = () => {
    console.log("🔙 Returning to game selection");
    setSelectedGame(null);
    setGameError(null);
  };

  // Error boundary for game rendering
  const renderSelectedGame = () => {
    if (!selectedGame) return null;

    try {
      // Special handling for Viking Castle (legacy)
      if (selectedGame === "viking-castle" || selectedGame === "viking-castle-geometry") {
        return <VikingCastleGame onBack={handleGameBack} />;
      }
      
      // All other games use the new game engine
      return (
        <SampleGame 
          gameId={selectedGame} 
          onBack={handleGameBack}
          onComplete={handleGameComplete}
        />
      );
    } catch (error) {
      console.error("🚫 Error rendering game:", error);
      return (
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Game Error</h3>
            <p className="text-red-300 mb-4">
              Sorry, there was an error loading this game.
            </p>
            <button 
              onClick={handleGameBack}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Back to Games
            </button>
          </CardContent>
        </Card>
      );
    }
  };

  // Show error state if there's a game error
  if (gameError) {
    return (
      <Card className="bg-red-900 border-red-700 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Game Loading Error</h3>
          <p className="text-red-300 mb-4">{gameError}</p>
          <button 
            onClick={() => {
              setGameError(null);
              setSelectedGame(null);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Back to Game Selection
          </button>
        </CardContent>
      </Card>
    );
  }

  // Render the selected game
  if (selectedGame) {
    return renderSelectedGame();
  }

  // Render game selection UI
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="w-6 h-6 text-lime-400" />
            <span>Educational Gaming Center</span>
            <Badge variant="outline" className="bg-lime-400 text-gray-900 border-lime-400">
              Curriculum Aligned!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-800/30">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Learn Through Play</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Our educational games are carefully designed to align with curriculum standards. 
              Each game targets specific learning objectives while keeping students engaged through interactive gameplay.
            </p>
          </div>

          <CurriculumGameSelector 
            onGameSelect={handleGameSelect}
            userGradeLevel={6}
          />
        </CardContent>
      </Card>

      <LeaderboardCard />
    </div>
  );
};

export default GameHub;
