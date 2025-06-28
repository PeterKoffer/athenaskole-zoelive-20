
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface BodyLabWelcomeProps {
  onStartLesson: () => void;
  studentName: string;
  onBackToProgram?: () => void;
}

export const BodyLabWelcome = ({ onStartLesson, studentName, onBackToProgram }: BodyLabWelcomeProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartLesson();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-green-900 via-teal-800 to-blue-900 border-green-400/50 text-white shadow-2xl">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">💪</div>
          <div className="text-4xl mb-2">🏃‍♂️</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent">
          BodyLab Adventure!
        </h1>
        
        <p className="text-xl text-green-200 mb-2">
          Health, Fitness & Body Wellness
        </p>
        
        <div className="bg-green-800/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-green-100 leading-relaxed">
            Welcome to the amazing world of BodyLab, {studentName}! Today we're going to explore 
            health, fitness, nutrition, and how to take care of our amazing bodies. Get ready 
            to discover how staying active and healthy helps us feel great and perform our best!
          </p>
        </div>

        <div className="bg-teal-800/40 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-teal-200 mb-4 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            What You'll Discover Today:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-100">
            <div>• Healthy eating habits</div>
            <div>• Fun fitness activities</div>
            <div>• Body systems and how they work</div>
            <div>• Mental wellness and self-care</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBackToProgram && (
            <Button
              onClick={onBackToProgram}
              variant="outline"
              className="border-green-400 text-green-300 hover:bg-green-800/50 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          
          <Button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start BodyLab Adventure
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
