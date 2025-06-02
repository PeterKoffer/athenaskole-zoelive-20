
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";
import GameCard from "@/components/games/GameCard";
import LeaderboardCard from "@/components/games/LeaderboardCard";

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: "viking-castle",
      title: "Build A Viking Castle",
      description: "Learn geometry and mathematics by building a viking castle and defending it from attacks!",
      subject: "Mathematics",
      difficulty: "Medium",
      timeEstimate: "15-20 min",
      emoji: "🏰",
      rewards: "50 Learning Coins + Math Viking badge",
      status: "available"
    },
    {
      id: "word-hunt",
      title: "Word Hunt AR",
      description: "Use your phone to find objects in the real world and spell them correctly!",
      subject: "English",
      difficulty: "Easy",
      timeEstimate: "10-15 min",
      emoji: "🔍",
      rewards: "30 Learning Coins + Word Hunter badge",
      status: "available"
    },
    {
      id: "sandwich-coding",
      title: "Code a Sandwich",
      description: "Learn logic and algorithms by stacking ingredients in the correct order!",
      subject: "Programming",
      difficulty: "Medium",
      timeEstimate: "20-25 min",
      emoji: "🥪",
      rewards: "60 Learning Coins + Code Master badge",
      status: "available"
    },
    {
      id: "time-travel",
      title: "Viking Age Adventure",
      description: "Travel back to the Viking Age and help Harald Bluetooth solve problems!",
      subject: "History",
      difficulty: "Easy",
      timeEstimate: "25-30 min",
      emoji: "⚔️",
      rewards: "40 Learning Coins + Time Traveler badge",
      status: "available"
    },
    {
      id: "windmill-builder",
      title: "Build A Windmill",
      description: "Learn about renewable energy by designing and building your own windmill!",
      subject: "Science & Technology",
      difficulty: "Hard",
      timeEstimate: "30-35 min",
      emoji: "🌪️",
      rewards: "80 Learning Coins + Green Engineer badge",
      status: "available"
    },
    {
      id: "music-composer",
      title: "Compose with Carl Nielsen",
      description: "Create beautiful melodies together with the famous Danish composer Carl Nielsen!",
      subject: "Music",
      difficulty: "Medium",
      timeEstimate: "20-25 min",
      emoji: "🎵",
      rewards: "50 Learning Coins + Composer badge",
      status: "available"
    }
  ];

  if (selectedGame === "viking-castle") {
    return <VikingCastleGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Trophy className="w-6 h-6 text-lime-400" />
            <span>Hidden Learning Games</span>
            <Badge variant="outline" className="bg-lime-400 text-gray-900 border-lime-400">
              Learn while you play!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onGameSelect={setSelectedGame}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <LeaderboardCard />
    </div>
  );
};

export default GameHub;
