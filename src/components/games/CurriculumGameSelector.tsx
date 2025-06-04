
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { curriculumGames, getGamesBySubject, getGamesByGradeLevel, filterGames, type CurriculumGame } from "./CurriculumGameConfig";
import GameCard from "./components/GameCard";
import GameFilters from "./components/GameFilters";
import GameSelectorHeader from "./components/GameSelectorHeader";
import { getDifficultyColor, getSubjectColor } from "./utils/GameSelectorUtils";

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

  const filteredGames = filterGames(selectedSubject, selectedGrade, selectedDifficulty);
  const subjects = [...new Set(curriculumGames.map(game => game.subject))];
  const gradeRecommendations = getGamesByGradeLevel(userGradeLevel);

  return (
    <div className="space-y-6">
      <GameSelectorHeader />

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
          <GameFilters
            selectedSubject={selectedSubject}
            selectedGrade={selectedGrade}
            selectedDifficulty={selectedDifficulty}
            subjects={subjects}
            onSubjectChange={setSelectedSubject}
            onGradeChange={setSelectedGrade}
            onDifficultyChange={setSelectedDifficulty}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onGameSelect={onGameSelect}
                getDifficultyColor={getDifficultyColor}
                getSubjectColor={getSubjectColor}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Perfect for Grade {userGradeLevel}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradeRecommendations.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onGameSelect={onGameSelect}
                  getDifficultyColor={getDifficultyColor}
                  getSubjectColor={getSubjectColor}
                />
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
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onGameSelect={onGameSelect}
                        getDifficultyColor={getDifficultyColor}
                        getSubjectColor={getSubjectColor}
                      />
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
