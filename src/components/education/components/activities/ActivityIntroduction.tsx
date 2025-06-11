
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityIntroductionProps {
  activity: LessonActivity;
  onActivityComplete: () => void;
}

const ActivityIntroduction = ({ activity, onActivityComplete }: ActivityIntroductionProps) => {
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  console.log('🎭 ActivityIntroduction rendering:', {
    activityId: activity.id,
    title: activity.title
  });

  // Show continue button after a delay, but don't auto-advance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinueButton(true);
    }, 3000); // 3 second delay before showing button

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setHasUserInteracted(true);
    onActivityComplete();
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-gray-700">
      <CardContent className="p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">{activity.title}</h2>
        <p className="text-xl mb-6 text-gray-200">
          {activity.content.hook || 'Welcome to your lesson!'}
        </p>
        
        {showContinueButton && (
          <Button
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3"
          >
            Let's Begin!
          </Button>
        )}
        
        {!showContinueButton && (
          <div className="text-gray-300">
            Get ready to start learning...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityIntroduction;
