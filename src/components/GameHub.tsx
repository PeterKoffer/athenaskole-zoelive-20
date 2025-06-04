import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";
import CurriculumGameSelector from "@/components/games/CurriculumGameSelector";
import LeaderboardCard from "@/components/games/LeaderboardCard";
import SampleGame from "@/components/games/SampleGame";
import { useToast } from "@/hooks/use-toast";

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle game selection
  const handleGameSelect = (gameId: string) => {
    console.log("Selected game:", gameId);
    setSelectedGame(gameId);
  };

  // Handle game completion
  const handleGameComplete = (score: number, achievements: string[]) => {
    toast({
      title: "Game Completed!",
      description: `You earned ${score} points and ${achievements.length} achievements!`,
      duration: 5000
    });
    
    // Return to game selection screen
    setSelectedGame(null);
  };

  // Render the selected game
  if (selectedGame) {
    // For backward compatibility, keep the special case for Viking Castle
    if (selectedGame === "viking-castle" || selectedGame === "viking-castle-geometry") {
      return <VikingCastleGame onBack={() => setSelectedGame(null)} />;
    }
    
    // All other games use the new game engine
    return (
      <SampleGame 
        gameId={selectedGame} 
        onBack={() => setSelectedGame(null)}
        onComplete={handleGameComplete}
      />
    );
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
