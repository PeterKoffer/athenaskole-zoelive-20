
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface LessonControlsCardProps {
  phase: 'lesson' | 'paused';
  onPause: () => void;
  onResume: () => void;
}

const LessonControlsCard = ({ phase, onPause, onResume }: LessonControlsCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="text-white">
          <p className="font-semibold">20-Minute Mathematics Adventure with Nelie</p>
          <p className="text-sm text-gray-400">
            Interactive questions, games, and personalized tutoring
          </p>
        </div>
        <div className="flex space-x-2">
          {phase === 'lesson' ? (
            <Button onClick={onPause} variant="outline" size="sm">
              <Pause className="w-4 h-4 mr-2" />
              Pause Lesson
            </Button>
          ) : (
            <Button onClick={onResume} className="bg-green-600 hover:bg-green-700" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Resume Lesson
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonControlsCard;
