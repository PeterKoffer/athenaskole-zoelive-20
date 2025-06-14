
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Star } from 'lucide-react';

interface LessonProgressHeaderProps {
  timeElapsed: number;
  score: number;
  currentActivityIndex: number;
  totalActivities: number;
  targetLessonLength?: number;
  correctStreak?: number;
  engagementLevel?: number;
  questionsGenerated?: number;
  onBackToProgram?: () => void;
}

const LessonProgressHeader = ({
  timeElapsed,
  score,
  currentActivityIndex,
  totalActivities,
  targetLessonLength = 1200, // 20 minutes in seconds
  correctStreak,
  engagementLevel,
  questionsGenerated
}: LessonProgressHeaderProps) => {
  // Convert timeElapsed (seconds) to minutes for display
  const timeElapsedMinutes = Math.floor(timeElapsed / 60);
  const timeElapsedSeconds = timeElapsed % 60;
  
  // Convert target length (seconds) to minutes for display
  const targetMinutes = Math.floor(targetLessonLength / 60);
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-lime-400" />
            <span className="text-sm">
              {timeElapsedMinutes}:{timeElapsedSeconds.toString().padStart(2, '0')} / {targetMinutes}:00
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm">Score: {score}</span>
          </div>
          <div className="text-sm">
            Activity {currentActivityIndex + 1} of {totalActivities}
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div 
            className="bg-lime-400 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${(currentActivityIndex + 1) / totalActivities * 100}%` }} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonProgressHeader;
