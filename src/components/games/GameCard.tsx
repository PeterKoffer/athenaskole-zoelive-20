
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  timeEstimate: string;
  emoji: string;
  rewards: string;
  status: string;
}

interface GameCardProps {
  game: Game;
  onGameSelect: (gameId: string) => void;
}

const GameCard = ({ game, onGameSelect }: GameCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-900 text-green-400 border-green-400";
      case "Medium": return "bg-yellow-900 text-yellow-400 border-yellow-400";
      case "Hard": return "bg-red-900 text-red-400 border-red-400";
      default: return "bg-gray-900 text-gray-400 border-gray-400";
    }
  };

  const getSubjectColor = (subject: string) => {
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

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 hover:border-lime-400">
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
          onClick={() => game.status === "available" && onGameSelect(game.id)}
        >
          {game.status === "available" ? "Play Now" : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
