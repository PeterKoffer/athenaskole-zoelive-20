
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target } from 'lucide-react';

interface MathLessonHeaderProps {
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  onBackToProgram: () => void;
}

const MathLessonHeader = ({
  studentName,
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  onBackToProgram
}: MathLessonHeaderProps) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-900 to-blue-900 border-b border-purple-400">
      <div className="w-full max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onBackToProgram}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / {targetLessonLength}:00</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
            
            <div className="text-sm">
              Activity {currentActivityIndex + 1}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold text-white">
            Mathematics with Nelie - {studentName}'s Lesson
            {correctStreak > 0 && (
              <span className="ml-2 text-green-400">🔥 {correctStreak} streak!</span>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MathLessonHeader;
