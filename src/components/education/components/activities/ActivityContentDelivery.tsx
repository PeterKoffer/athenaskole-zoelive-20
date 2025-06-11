
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityContentDeliveryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit?: (wasCorrect: boolean) => void;
}

const ActivityContentDelivery = ({
  activity,
  timeRemaining,
  onContinue,
  onAnswerSubmit
}: ActivityContentDeliveryProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Reset interaction state when activity changes
  useEffect(() => {
    setHasInteracted(false);
  }, [activity.id]);

  const handleContinueClick = () => {
    setHasInteracted(true);
    onContinue();
  };

  const renderContent = () => {
    if (activity.content.segments && activity.content.segments.length > 0) {
      return (
        <div className="space-y-4">
          {activity.content.segments.map((segment: any, index: number) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              {segment.title && (
                <h4 className="text-lg font-semibold text-white mb-2">{segment.title}</h4>
              )}
              {segment.explanation && (
                <p className="text-gray-200 leading-relaxed">{segment.explanation}</p>
              )}
              {segment.example && (
                <div className="mt-3 p-3 bg-gray-600 rounded border-l-4 border-blue-500">
                  <p className="text-blue-200 font-medium">Example:</p>
                  <p className="text-gray-200">{segment.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-gray-700 rounded-lg p-6">
        <p className="text-gray-200 text-lg leading-relaxed">
          {activity.content.text || activity.content.explanation || 'Content is being prepared...'}
        </p>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>{activity.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderContent()}

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleContinueClick}
            disabled={hasInteracted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
          >
            {hasInteracted ? 'Continuing...' : 'Continue to Next Activity'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityContentDelivery;
