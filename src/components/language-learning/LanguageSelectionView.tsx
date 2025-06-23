
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Trophy, ArrowLeft, BookOpen, Layers, FileText } from "lucide-react"; // Added icons
import { LanguageLabLanguage, LanguageLabCurriculum, CurriculumLevel, CurriculumUnit, CurriculumLessonLink } from "./types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface LanguageSelectionViewProps {
  languages: LanguageLabLanguage[];
  selectedLanguageCode?: string;
  curriculum: LanguageLabCurriculum | null;
  isLoadingCurriculum: boolean;
  hearts: number;
  streak: number;
  xp: number;
  onLanguageSelect: (languageCode: string) => void;
  onLessonSelect: (lessonPath: string) => void;
  onBack: () => void;
  currentLanguageName?: string; // Added to display current language name
}

const LanguageSelectionView = ({
  languages,
  selectedLanguageCode,
  curriculum,
  isLoadingCurriculum,
  hearts,
  streak,
  xp,
  onLanguageSelect,
  onLessonSelect,
  onBack,
  currentLanguageName
}: LanguageSelectionViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-white border-gray-600 hover:bg-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Daily Program
        </Button>

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">Language Lab</span>
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1" title="Hearts">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-white">{hearts}</span>
                </div>
                <div className="flex items-center space-x-1" title="Day Streak">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-white">{streak}</span>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-purple-500 px-3 py-1 text-sm">
                  {xp} XP
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">Select a language to start your learning journey:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className={`h-24 ${lang.color} hover:opacity-90 text-white flex flex-col items-center justify-center space-y-1 p-2 rounded-lg shadow-md transition-all duration-200 ${
                    selectedLanguageCode === lang.code ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-lime-400' : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => onLanguageSelect(lang.code)}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="text-xs font-medium text-center">{lang.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedLanguageCode && isLoadingCurriculum && (
          <div className="flex justify-center items-center p-10">
            <LoadingSpinner />
            <p className="ml-3 text-lg">Loading {currentLanguageName} curriculum...</p>
          </div>
        )}

        {selectedLanguageCode && !isLoadingCurriculum && curriculum && (
          <Card className="bg-gray-800 border-gray-700 shadow-xl mt-6">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-lime-400">
                Curriculum: {curriculum.languageName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {curriculum.levels && curriculum.levels.length > 0 ? (
                curriculum.levels.map((level: CurriculumLevel) => (
                  <div key={level.levelId} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h3 className="text-xl font-semibold text-purple-300 mb-1 flex items-center">
                      <Layers className="w-5 h-5 mr-2" /> {level.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 ml-7">{level.description}</p>
                    {level.units.map((unit: CurriculumUnit) => (
                      <div key={unit.unitId} className="ml-7 mb-4 last:mb-0">
                        <h4 className="text-lg font-medium text-cyan-300 mb-2 flex items-center">
                           <BookOpen className="w-4 h-4 mr-2 opacity-80" /> {unit.title}
                        </h4>
                        <div className="space-y-2">
                          {unit.lessons.map((lessonLink: CurriculumLessonLink) => (
                            <Button
                              key={lessonLink.lessonId}
                              variant="ghost"
                              className="w-full h-auto py-3 bg-gray-700 border border-gray-600 hover:bg-gray-600/70 text-white justify-start text-left rounded-md transition-colors duration-150"
                              onClick={() => onLessonSelect(lessonLink.lessonPath)}
                            >
                              <FileText className="w-5 h-5 mr-3 text-lime-400 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-medium">{lessonLink.title}</span>
                                <span className="text-xs text-gray-400">ID: {lessonLink.lessonId}</span>
                              </div>
                              {/* Placeholder for progress indicator if available later */}
                              {/* <Star className="w-5 h-5 text-yellow-500 ml-auto" /> */}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No levels available for this language yet.</p>
              )}
            </CardContent>
          </Card>
        )}
         {!selectedLanguageCode && !isLoadingCurriculum && (
          <div className="text-center text-gray-500 py-10">
            <p>Please select a language to view its curriculum.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelectionView;
