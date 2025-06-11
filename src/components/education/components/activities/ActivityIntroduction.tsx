
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityIntroductionProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  isNelieReady: boolean;
}

const ActivityIntroduction = ({
  activity,
  timeRemaining,
  onContinue,
  isNelieReady
}: ActivityIntroductionProps) => {
  const [hasStarted, setHasStarted] = useState(false);

  // Reset state when activity changes
  useEffect(() => {
    setHasStarted(false);
  }, [activity.id]);

  const handleStartClick = () => {
    setHasStarted(true);
    
    // Trigger scroll to assignment section after short delay
    setTimeout(() => {
      const assignmentSection = document.querySelector('[data-assignment-section]');
      if (assignmentSection) {
        assignmentSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 500);
    
    onContinue();
  };

  return (
    <Card className="bg-slate-900 border-slate-700 mx-2 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-lg sm:text-xl">
          <span className="break-words">{activity.title}</span>
          <div className="flex items-center space-x-2 text-sm sm:text-base">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 rounded-lg p-4 sm:p-6 border border-blue-800/50">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Welcome to Your Learning Journey!</h3>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
            {activity.content.hook || activity.content.text || 'Let\'s begin this exciting lesson together!'}
          </p>
        </div>

        {isNelieReady && (
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border-l-4 border-green-500">
            <p className="text-green-400 font-medium text-sm sm:text-base">🎤 Nelie is ready to guide you!</p>
            <p className="text-slate-300 text-xs sm:text-sm">Your AI learning companion will help explain concepts and answer questions.</p>
          </div>
        )}

        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={handleStartClick}
            disabled={hasStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold w-full sm:w-auto"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {hasStarted ? 'Starting Lesson...' : 'Start Learning'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityIntroduction;
