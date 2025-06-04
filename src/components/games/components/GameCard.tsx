
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Trophy } from "lucide-react";
import { CurriculumGame } from '../types/GameTypes';

interface GameCardProps {
  game: CurriculumGame;
  onGameSelect: (gameId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getSubjectColor: (subject: string) => string;
}

const GameCard = ({ game, onGameSelect, getDifficultyColor, getSubjectColor }: GameCardProps) => (
  <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-gray-800 border-gray-700 hover:border-lime-400 group">
    {game.status === "coming-soon" && (
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
          Coming Soon
        </Badge>
      </div>
    )}
    {game.status === "beta" && (
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="outline" className="bg-orange-900 text-orange-400 border-orange-400">
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
      <CardTitle className="text-lg text-white group-hover:text-lime-400 transition-colors">
        {game.title}
      </CardTitle>
    </CardHeader>
    
    <CardContent className="space-y-4">
      <p className="text-sm text-gray-300">{game.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{game.timeEstimate}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>Grades {game.gradeLevel.join(", ")}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-lime-400">
          <Trophy className="w-4 h-4" />
          <span>{game.rewards.coins} coins + {game.rewards.badges.join(", ")}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Learning Focus:</p>
        <div className="flex flex-wrap gap-1">
          {game.skillAreas.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
              {skill.replace(/_/g, " ")}
            </Badge>
          ))}
          {game.skillAreas.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
              +{game.skillAreas.length - 3} more
            </Badge>
          )}
        </div>
      </div>

      <Button
        className="w-full"
        variant={game.status === "available" ? "default" : "secondary"}
        disabled={game.status === "coming-soon"}
        onClick={() => game.status === "available" && onGameSelect(game.id)}
      >
        {game.status === "available" ? "Start Learning Game" : 
         game.status === "beta" ? "Try Beta Version" : "Coming Soon"}
      </Button>
    </CardContent>
  </Card>
);

export default GameCard;
