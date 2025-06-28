
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface LifeEssentialsWelcomeProps {
  onStartLesson: () => void;
  studentName: string;
  onBackToProgram?: () => void;
}

export const LifeEssentialsWelcome = ({ onStartLesson, studentName, onBackToProgram }: LifeEssentialsWelcomeProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartLesson();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900 border-slate-400/50 text-white shadow-2xl">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">📋</div>
          <div className="text-4xl mb-2">🏠</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-400 to-gray-300 bg-clip-text text-transparent">
          Life Essentials Adventure!
        </h1>
        
        <p className="text-xl text-slate-200 mb-2">
          Practical Life Skills & Independence
        </p>
        
        <div className="bg-slate-800/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-slate-100 leading-relaxed">
            Welcome to the practical world of Life Essentials, {studentName}! Today we're going to explore 
            important life skills like managing money, cooking, time management, and other skills that help 
            us become independent and successful. Get ready to learn skills you'll use every day!
          </p>
        </div>

        <div className="bg-gray-800/40 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            What You'll Discover Today:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-100">
            <div>• Money management basics</div>
            <div>• Time organization skills</div>
            <div>• Basic cooking and nutrition</div>
            <div>• Problem-solving strategies</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBackToProgram && (
            <Button
              onClick={onBackToProgram}
              variant="outline"
              className="border-slate-400 text-slate-300 hover:bg-slate-800/50 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          
          <Button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Life Skills Journey
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
