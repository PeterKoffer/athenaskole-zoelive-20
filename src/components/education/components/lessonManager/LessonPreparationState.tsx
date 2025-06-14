
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface LessonPreparationStateProps {
  subject: string;
  activitiesCount: number;
  onRegenerate: () => void;
}

const LessonPreparationState = ({ 
  subject, 
  activitiesCount, 
  onRegenerate 
}: LessonPreparationStateProps) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 text-center space-y-4">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Preparing your {subject} lesson...
          </h3>
          <p className="text-gray-400">
            Setting up {activitiesCount} personalized learning activities
          </p>
        </div>
        <Button 
          onClick={onRegenerate}
          variant="outline"
          className="mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Lesson
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonPreparationState;
