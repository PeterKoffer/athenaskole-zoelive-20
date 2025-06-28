
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface LanguageLabWelcomeProps {
  onStartLesson: () => void;
  studentName: string;
  onBackToProgram?: () => void;
}

export const LanguageLabWelcome = ({ onStartLesson, studentName, onBackToProgram }: LanguageLabWelcomeProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartLesson();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-900 via-red-800 to-pink-900 border-orange-400/50 text-white shadow-2xl">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-4xl mb-2">🗣️</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-300 bg-clip-text text-transparent">
          Language Lab Adventure!
        </h1>
        
        <p className="text-xl text-orange-200 mb-2">
          World Languages & Communication
        </p>
        
        <div className="bg-orange-800/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-orange-100 leading-relaxed">
            Welcome to the exciting world of Language Lab, {studentName}! Today we're going to explore 
            different languages, cultures, and ways people communicate around the world. Get ready 
            to discover how languages connect us and open doors to amazing adventures!
          </p>
        </div>

        <div className="bg-red-800/40 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-red-200 mb-4 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            What You'll Discover Today:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-100">
            <div>• Basic words in different languages</div>
            <div>• Cultural traditions and customs</div>
            <div>• Fun language games and activities</div>
            <div>• How languages connect people</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBackToProgram && (
            <Button
              onClick={onBackToProgram}
              variant="outline"
              className="border-orange-400 text-orange-300 hover:bg-orange-800/50 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          
          <Button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Language Adventure
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
