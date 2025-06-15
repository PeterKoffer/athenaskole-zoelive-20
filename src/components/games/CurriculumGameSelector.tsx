
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadK12Games, getGamesByGrade, getGamesBySubject } from "./utils/GameDataLoader";
import { type CurriculumGame } from "./types/GameTypes";
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
  const [allGames, setAllGames] = useState<CurriculumGame[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all games on component mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const games = await loadK12Games();
        console.log(`🎮 Loaded ${games.length} total games for display`);
        setAllGames(games);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);

  // Filter games based on selected criteria
  const filteredGames = allGames.filter(game => {
    const matchesSubject = selectedSubject === "all" || game.subject === selectedSubject;
    const matchesGrade = selectedGrade === "all" || game.gradeLevel.includes(parseInt(selectedGrade));
    const matchesDifficulty = selectedDifficulty === "all" || game.difficulty === selectedDifficulty;
    
    return matchesSubject && matchesGrade && matchesDifficulty;
  });

  // Get unique subjects from all games
  const subjects = [...new Set(allGames.map(game => game.subject))];
  
  // Get grade-specific recommendations
  const gradeRecommendations = allGames.filter(game => 
    game.gradeLevel.includes(userGradeLevel)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="text-gray-300">Loading educational games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GameSelectorHeader />

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-lime-400 font-semibold">
          🎮 {allGames.length} Educational Games Available | Showing {filteredGames.length} games
        </p>
        <p className="text-gray-300 text-sm mt-1">
          Comprehensive K-12 curriculum-aligned games across all subjects
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-lime-500">
            All Games ({filteredGames.length})
          </TabsTrigger>
          <TabsTrigger value="recommended" className="data-[state=active]:bg-lime-500">
            Grade {userGradeLevel} ({gradeRecommendations.length})
          </TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-lime-500">
            By Subject ({subjects.length})
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

          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No games match your current filters.</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters to see more games.</p>
            </div>
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="recommended">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Perfect for Grade {userGradeLevel}</h3>
            {gradeRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No games specifically for Grade {userGradeLevel} yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check out "All Games" to see available options.</p>
              </div>
            ) : (
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="space-y-6">
            {subjects.map(subject => {
              const subjectGames = allGames.filter(game => game.subject === subject);
              return (
                <div key={subject}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Badge variant="outline" className={getSubjectColor(subject) + " mr-2"}>
                      {subject}
                    </Badge>
                    {subjectGames.length} games available
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectGames.slice(0, 6).map((game) => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onGameSelect={onGameSelect}
                        getDifficultyColor={getDifficultyColor}
                        getSubjectColor={getSubjectColor}
                      />
                    ))}
                  </div>
                  {subjectGames.length > 6 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Showing 6 of {subjectGames.length} {subject} games. Use filters to see more.
                    </p>
                  )}
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
