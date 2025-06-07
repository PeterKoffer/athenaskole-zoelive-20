
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { LessonPhase } from './LessonStateManager';

interface LessonControlsCardProps {
  phase: LessonPhase;
  onPause: () => void;
  onResume: () => void;
}

const LessonControlsCard = ({
  phase,
  onPause,
  onResume
}: LessonControlsCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm text-gray-400">Lesson Status</p>
            <p className="font-semibold">
              {phase === 'lesson' ? 'In Progress' : 'Paused'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {phase === 'lesson' ? (
              <Button
                onClick={onPause}
                variant="outline"
                size="sm"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause Lesson
              </Button>
            ) : (
              <Button
                onClick={onResume}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Lesson
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonControlsCard;
