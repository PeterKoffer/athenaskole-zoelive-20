
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface LessonPausedViewProps {
  onResume: () => void;
  onBackToProgram: () => void;
}

const LessonPausedView = ({ onResume, onBackToProgram }: LessonPausedViewProps) => {
  return (
    <Card className="bg-yellow-900 border-yellow-600">
      <CardContent className="p-8 text-center">
        <Pause className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Lesson Paused</h2>
        <p className="text-yellow-200 mb-6">
          Your progress has been saved. You can resume this lesson anytime.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={onResume} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" />
            Resume Lesson
          </Button>
          <Button 
            variant="outline" 
            onClick={onBackToProgram}
            className="border-gray-600 text-white"
          >
            Back to Program
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonPausedView;
