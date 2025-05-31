
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Trophy } from "lucide-react";
import { Language, LanguageLessons } from "./types";

interface LanguageSelectionViewProps {
  languages: Language[];
  selectedLanguage: string;
  lessons: LanguageLessons;
  hearts: number;
  streak: number;
  xp: number;
  onLanguageSelect: (languageCode: string) => void;
  onLessonSelect: (lessonIndex: number) => void;
}

const LanguageSelectionView = ({ 
  languages, 
  selectedLanguage, 
  lessons, 
  hearts, 
  streak, 
  xp, 
  onLanguageSelect, 
  onLessonSelect 
}: LanguageSelectionViewProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span>Language Learning - Duolingo Style</span>
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-white">{hearts}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-white">{streak} day streak</span>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white border-purple-400">
                {xp} XP
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant="outline"
                className={`h-20 bg-gray-800 border-gray-600 hover:bg-gray-700 text-white flex flex-col space-y-2 ${
                  selectedLanguage === lang.code ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => onLanguageSelect(lang.code)}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedLanguage && lessons[selectedLanguage] && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Lessons in {languages.find(l => l.code === selectedLanguage)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lessons[selectedLanguage].map((lesson, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-16 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white justify-between"
                  onClick={() => onLessonSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <span>{lesson.title}</span>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LanguageSelectionView;
