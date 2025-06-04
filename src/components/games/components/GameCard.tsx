
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Gamepad2 } from "lucide-react";
import { CurriculumGame } from "../types/GameTypes";

interface GameCardProps {
  game: CurriculumGame;
  onGameSelect: (gameId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getSubjectColor: (subject: string) => string;
}

const GameCard = ({ game, onGameSelect, getDifficultyColor, getSubjectColor }: GameCardProps) => {
  const getInteractionIcon = (interactionType: string) => {
    switch (interactionType) {
      case 'drag-drop': return '🖱️';
      case 'click-sequence': return '👆';
      case 'drawing': return '🎨';
      case 'typing': return '⌨️';
      case 'multiple-choice': return '✅';
      case 'simulation': return '🔬';
      case 'puzzle': return '🧩';
      case 'memory': return '🧠';
      case 'timing': return '⏱️';
      case 'strategy': return '♟️';
      default: return '🎮';
    }
  };

  const getInteractionDescription = (interactionType: string) => {
    switch (interactionType) {
      case 'drag-drop': return 'Drag & Drop';
      case 'click-sequence': return 'Click Sequence';
      case 'drawing': return 'Creative Design';
      case 'typing': return 'Keyboard Input';
      case 'multiple-choice': return 'Multiple Choice';
      case 'simulation': return 'Simulation';
      case 'puzzle': return 'Logic Puzzle';
      case 'memory': return 'Memory Game';
      case 'timing': return 'Timing Challenge';
      case 'strategy': return 'Strategy Game';
      default: return 'Interactive Game';
    }
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
      
      {game.status === "beta" && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-orange-700 text-orange-300 border-orange-600">
            Beta
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
          
          <div className="flex items-center space-x-2 text-sm text-purple-400">
            <Gamepad2 className="w-4 h-4" />
            <span>{getInteractionIcon(game.interactionType)} {getInteractionDescription(game.interactionType)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-lime-400">
            <Star className="w-4 h-4" />
            <span>{game.rewards.coins} coins</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {game.skillAreas.slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
              {skill.replace('_', ' ')}
            </Badge>
          ))}
          {game.skillAreas.length > 2 && (
            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
              +{game.skillAreas.length - 2} more
            </Badge>
          )}
        </div>

        <Button
          className="w-full"
          variant={game.status === "available" ? "default" : "secondary"}
          disabled={game.status === "coming-soon"}
          onClick={() => game.status === "available" && onGameSelect(game.id)}
        >
          {game.status === "available" ? "Play Now" : 
           game.status === "beta" ? "Try Beta" : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
