
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen } from 'lucide-react';
import { LessonPhase } from '../contexts/UnifiedLessonContext';

interface LessonProgressTrackerProps {
  currentTime: number;
  totalTime: number;
  currentSegment: number;
  totalSegments: number;
  phase: LessonPhase;
}

const LessonProgressTracker = ({
  currentTime,
  totalTime,
  currentSegment,
  totalSegments,
  phase
}: LessonProgressTrackerProps) => {
  const timeProgress = (currentTime / totalTime) * 100;
  const segmentProgress = (currentSegment / totalSegments) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-w-[300px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Time: {formatTime(currentTime)} / {formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>Progress: {currentSegment}/{totalSegments}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={timeProgress} className="h-2" />
          <Progress value={segmentProgress} className="h-2 bg-blue-900" />
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          {phase === 'lesson' ? 'Learning in progress...' : 'Lesson paused'}
        </p>
      </div>
    </div>
  );
};

export default LessonProgressTracker;
