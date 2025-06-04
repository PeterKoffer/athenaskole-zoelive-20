
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LessonControlsFooterProps {
  timeElapsed: number;
  totalLessonTime: number;
  onBack: () => void;
}

const LessonControlsFooter = ({
  timeElapsed,
  totalLessonTime,
  onBack
}: LessonControlsFooterProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4 flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950">
          Exit Lesson
        </Button>
        
        <div className="text-white text-sm">
          Estimated time remaining: {Math.max(0, Math.floor((totalLessonTime - timeElapsed) / 60))} minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonControlsFooter;
