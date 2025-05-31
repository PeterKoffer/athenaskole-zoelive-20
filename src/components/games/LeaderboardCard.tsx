
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Player {
  name: string;
  points: number;
  badge: string;
}

const LeaderboardCard = () => {
  const players: Player[] = [
    { name: "Sophie M.", points: 2450, badge: "🏆" },
    { name: "You (Emil)", points: 2210, badge: "🥈" },
    { name: "Marcus L.", points: 2180, badge: "🥉" },
    { name: "Anna K.", points: 1950, badge: "⭐" },
    { name: "Tobias R.", points: 1820, badge: "⭐" }
  ];

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Users className="w-6 h-6 text-lime-400" />
          <span>Class Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player, index) => (
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
  );
};

export default LeaderboardCard;
