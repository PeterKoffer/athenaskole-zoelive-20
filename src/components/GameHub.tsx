
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Clock, Users } from "lucide-react";
import VikingCastleGame from "@/components/games/VikingCastleGame";

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
      status: "coming-soon"
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
      status: "coming-soon"
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
      status: "coming-soon"
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
      status: "coming-soon"
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
      status: "coming-soon"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-900 text-green-400 border-green-400";
      case "Medium": return "bg-yellow-900 text-yellow-400 border-yellow-400";
      case "Hard": return "bg-red-900 text-red-400 border-red-400";
      default: return "bg-gray-900 text-gray-400 border-gray-400";
    }
  };

  const getSubjectColor = (subject) => {
    const colors = {
      "Mathematics": "bg-blue-900 text-blue-400 border-blue-400",
      "English": "bg-red-900 text-red-400 border-red-400",
      "Programming": "bg-purple-900 text-purple-400 border-purple-400",
      "History": "bg-orange-900 text-orange-400 border-orange-400",
      "Science & Technology": "bg-green-900 text-green-400 border-green-400",
      "Music": "bg-pink-900 text-pink-400 border-pink-400"
    };
    return colors[subject] || "bg-gray-900 text-gray-400 border-gray-400";
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
            <span>Hidden Learning Games</span>
            <Badge variant="outline" className="bg-lime-400 text-gray-900 border-lime-400">
              Learn while you play!
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.id} className="relative overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 hover:border-lime-400">
                {game.status === "coming-soon" && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                      Coming Soon
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{game.emoji}</span>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={getSubjectColor(game.subject)}>
                        {game.subject}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white">{game.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{game.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{game.timeEstimate}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-lime-400">
                      <Star className="w-4 h-4" />
                      <span>{game.rewards}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={game.status === "available" ? "default" : "secondary"}
                    disabled={game.status === "coming-soon"}
                    onClick={() => game.status === "available" && setSelectedGame(game.id)}
                  >
                    {game.status === "available" ? "Play Now" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Users className="w-6 h-6 text-lime-400" />
            <span>Class Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Sophie M.", points: 2450, badge: "🏆" },
              { name: "You (Emil)", points: 2210, badge: "🥈" },
              { name: "Marcus L.", points: 2180, badge: "🥉" },
              { name: "Anna K.", points: 1950, badge: "⭐" },
              { name: "Tobias R.", points: 1820, badge: "⭐" }
            ].map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                player.name.includes("You") ? "bg-lime-900/20 border-lime-400" : "bg-gray-800 border-gray-700"
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{player.badge}</span>
                  <span className="font-medium text-white">{player.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lime-400">{player.points}</span>
                  <span className="text-sm text-gray-400">points</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-800 border border-lime-400 rounded-lg">
            <p className="text-sm text-lime-400">
              <strong>Well done!</strong> <span className="text-gray-300">You are #2 in the class. Keep playing to reach first place! 🎯</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHub;
