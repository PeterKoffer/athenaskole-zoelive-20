
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, BookOpen, Clock, Trophy, Star } from "lucide-react";
import { curriculumGames, getGamesBySubject, getGamesByGradeLevel, type CurriculumGame } from "./CurriculumGameConfig";

interface CurriculumGameSelectorProps {
  onGameSelect: (gameId: string) => void;
  userGradeLevel?: number;
  preferredSubject?: string;
}

const CurriculumGameSelector = ({ 
  onGameSelect, 
  userGradeLevel = 6, 
  preferredSubject 
}: CurriculumGameSelectorProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(preferredSubject || "all");
  const [selectedGrade, setSelectedGrade] = useState<string>(userGradeLevel.toString());
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredGames = curriculumGames.filter(game => {
    const subjectMatch = selectedSubject === "all" || game.subject === selectedSubject;
    const gradeMatch = selectedGrade === "all" || game.gradeLevel.includes(parseInt(selectedGrade));
    const difficultyMatch = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
    
    return subjectMatch && gradeMatch && difficultyMatch;
  });

  const subjects = [...new Set(curriculumGames.map(game => game.subject))];
  const gradeRecommendations = getGamesByGradeLevel(userGradeLevel);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-900 text-green-400 border-green-400";
      case "intermediate": return "bg-yellow-900 text-yellow-400 border-yellow-400";
      case "advanced": return "bg-red-900 text-red-400 border-red-400";
      default: return "bg-gray-900 text-gray-400 border-gray-400";
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      "Mathematics": "bg-blue-900 text-blue-400 border-blue-400",
      "English": "bg-red-900 text-red-400 border-red-400",
      "Computer Science": "bg-purple-900 text-purple-400 border-purple-400",
      "History": "bg-orange-900 text-orange-400 border-orange-400",
      "Science": "bg-green-900 text-green-400 border-green-400",
      "Music": "bg-pink-900 text-pink-400 border-pink-400"
    };
    return colors[subject] || "bg-gray-900 text-gray-400 border-gray-400";
  };

  const GameCard = ({ game }: { game: CurriculumGame }) => (
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

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Star className="w-6 h-6 mr-2 text-lime-400" />
          Curriculum-Aligned Educational Games
        </h1>
        <p className="text-gray-400">
          Interactive games designed to match your grade level and learning objectives
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-lime-500">
            All Games
          </TabsTrigger>
          <TabsTrigger value="recommended" className="data-[state=active]:bg-lime-500">
            Recommended for You
          </TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-lime-500">
            By Subject
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="mb-4 flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-lg">
            <Filter className="w-5 h-5 text-gray-400" />
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {[1,2,3,4,5,6,7,8].map(grade => (
                  <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Perfect for Grade {userGradeLevel}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradeRecommendations.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="space-y-6">
            {subjects.map(subject => {
              const subjectGames = getGamesBySubject(subject);
              return (
                <div key={subject}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Badge variant="outline" className={getSubjectColor(subject) + " mr-2"}>
                      {subject}
                    </Badge>
                    {subjectGames.length} games available
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurriculumGameSelector;
