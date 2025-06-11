
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
  targetLessonLength = 20,
  correctStreak,
  engagementLevel,
  questionsGenerated
}: LessonProgressHeaderProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-lime-400" />
            <span className="text-sm">
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / {targetLessonLength}:00
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
