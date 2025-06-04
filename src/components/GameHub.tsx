
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";
import CurriculumGameSelector from "@/components/games/CurriculumGameSelector";
import LeaderboardCard from "@/components/games/LeaderboardCard";

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Handle game selection - you can expand this to route to different game components
  const handleGameSelect = (gameId: string) => {
    console.log("Selected game:", gameId);
    
    // For now, only the Viking Castle game is fully implemented
    if (gameId === "viking-castle-geometry" || gameId === "viking-castle") {
      setSelectedGame("viking-castle");
    } else {
      // For other games, show a coming soon message or redirect to development
      console.log(`Game ${gameId} selected - ready for implementation!`);
      // You can implement routing to other game components here
    }
  };

  if (selectedGame === "viking-castle") {
    return <VikingCastleGame onBack={() => setSelectedGame(null)} />;
  }

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
