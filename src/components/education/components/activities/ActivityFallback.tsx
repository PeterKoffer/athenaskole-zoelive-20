
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityFallbackProps {
  activity: LessonActivity;
  onActivityComplete: () => void;
}

const ActivityFallback = ({ activity, onActivityComplete }: ActivityFallbackProps) => {
  console.log('🎭 ActivityFallback rendering:', {
    activityId: activity.id,
    title: activity.title
  });

  const handleNext = () => {
    console.log('➡️ Moving to next activity');
    onActivityComplete();
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 text-center text-white">
        <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
        <p className="text-gray-300 mb-6">
          {activity.content.text || activity.content.hook || 'Activity content loading...'}
        </p>
        <Button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityFallback;
