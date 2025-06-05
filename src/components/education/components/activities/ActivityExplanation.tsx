
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityExplanationProps {
  activity: LessonActivity;
  timeRemaining: number;
  onActivityComplete: () => void;
}

const ActivityExplanation = ({ activity, timeRemaining, onActivityComplete }: ActivityExplanationProps) => {
  return (
    <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Brain className="w-8 h-8 text-blue-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
        </div>
        
        <div className="text-lg text-blue-100 mb-6 leading-relaxed">
          {activity.content.text}
        </div>
        
        {activity.content.examples && (
          <div className="bg-blue-800/30 rounded-lg p-4 mb-6">
            <h4 className="text-blue-200 font-semibold mb-3">Examples:</h4>
            <ul className="list-disc list-inside text-blue-100 space-y-1">
              {activity.content.examples.map((example: string, index: number) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-blue-300">
            Time remaining: {timeRemaining}s
          </div>
          <Button onClick={onActivityComplete} className="bg-blue-600 hover:bg-blue-700">
            Continue Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityExplanation;
