
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface MentalWellnessWelcomeProps {
  onStartLesson: () => void;
  studentName: string;
  onBackToProgram?: () => void;
}

export const MentalWellnessWelcome = ({ onStartLesson, studentName, onBackToProgram }: MentalWellnessWelcomeProps) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartLesson = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStartLesson();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 border-purple-400/50 text-white shadow-2xl">
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <div className="text-4xl mb-2">💙</div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent">
          Mental Wellness Adventure!
        </h1>
        
        <p className="text-xl text-purple-200 mb-2">
          Mindfulness, Emotions & Well-being
        </p>
        
        <div className="bg-purple-800/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-purple-100 leading-relaxed">
            Welcome to the wonderful world of Mental Wellness, {studentName}! Today we're going to explore 
            emotions, mindfulness, stress management, and how to keep our minds healthy and happy. Get ready 
            to discover amazing tools for feeling your best every day!
          </p>
        </div>

        <div className="bg-indigo-800/40 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-indigo-200 mb-4 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            What You'll Discover Today:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-100">
            <div>• Understanding emotions</div>
            <div>• Mindfulness techniques</div>
            <div>• Stress management strategies</div>
            <div>• Building resilience and confidence</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onBackToProgram && (
            <Button
              onClick={onBackToProgram}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-800/50 px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
          
          <Button
            onClick={handleStartLesson}
            disabled={isStarting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-200 transform hover:scale-105 min-w-[200px]"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Starting...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Wellness Journey
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
