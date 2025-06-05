
import { Card, CardContent } from '@/components/ui/card';

interface LessonProgressSectionProps {
  currentActivityIndex: number;
  totalActivities: number;
  currentActivityTitle: string;
}

const LessonProgressSection = ({
  currentActivityIndex,
  totalActivities,
  currentActivityTitle
}: LessonProgressSectionProps) => {
  const progressPercentage = ((currentActivityIndex + 1) / totalActivities) * 100;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Lesson Progress</span>
          <span className="text-gray-300">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>Activity {currentActivityIndex + 1} of {totalActivities}</span>
          <span>{currentActivityTitle}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonProgressSection;
