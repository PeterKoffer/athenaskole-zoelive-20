
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, CheckCircle } from 'lucide-react';

interface LessonProgressTrackerProps {
  currentTime: number;
  totalTime: number;
  currentSegment: number;
  totalSegments: number;
  phase: string;
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
  const remainingMinutes = Math.max(0, Math.floor((totalTime - currentTime) / 60));
  const remainingSeconds = Math.max(0, (totalTime - currentTime) % 60);

  const getPhaseIcon = () => {
    switch (phase) {
      case 'interactive':
        return <Play className="w-4 h-4 text-green-400" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 min-w-[300px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getPhaseIcon()}
            <span className="text-white font-medium">Lesson Progress</span>
          </div>
          <div className="text-sm text-gray-400">
            {remainingMinutes}:{remainingSeconds.toString().padStart(2, '0')} left
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Time</span>
            <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 25:00</span>
          </div>
          <Progress value={timeProgress} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Segments</span>
            <span>{currentSegment} / {totalSegments}</span>
          </div>
          <Progress value={segmentProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonProgressTracker;
