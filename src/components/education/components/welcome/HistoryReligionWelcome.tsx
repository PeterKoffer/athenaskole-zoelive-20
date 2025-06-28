
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface HistoryReligionWelcomeProps {
  onStartLesson: () => void;
  studentName: string;
  onBackToProgram?: () => void;
}

export const HistoryReligionWelcome = ({ onStartLesson, studentName, onBackToProgram }: HistoryReligionWelcomeProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartLesson();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900 border-amber-400/50 text-white shadow-2xl">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">📜</div>
          <div className="text-4xl mb-2">🏛️</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
          History & Religion Adventure!
        </h1>
        
        <p className="text-xl text-amber-200 mb-2">
          World History & Cultural Heritage
        </p>
        
        <div className="bg-amber-800/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-amber-100 leading-relaxed">
            Welcome to the fascinating world of History & Religion, {studentName}! Today we're going to explore 
            ancient civilizations, world religions, and the amazing stories of how people have lived throughout 
            history. Get ready to become a time traveler and discover incredible cultures and beliefs!
          </p>
        </div>

        <div className="bg-yellow-800/40 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-200 mb-4 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            What You'll Discover Today:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-100">
            <div>• Ancient civilizations and cultures</div>
            <div>• World religions and traditions</div>
            <div>• Historical events and figures</div>
            <div>• How the past shapes our world today</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBackToProgram && (
            <Button
              onClick={onBackToProgram}
              variant="outline"
              className="border-amber-400 text-amber-300 hover:bg-amber-800/50 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          
          <Button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start History Journey
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
