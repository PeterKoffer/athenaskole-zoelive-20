
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface ActivityIntroductionProps {
  activity: LessonActivity;
  onActivityComplete: () => void;
}

const ActivityIntroduction = ({ activity, onActivityComplete }: ActivityIntroductionProps) => {
  const [showContinueButton, setShowContinueButton] = useState(false);

  console.log('🎭 ActivityIntroduction rendering:', {
    activityId: activity.id,
    title: activity.title
  });

  // Show continue button immediately - no delay
  useEffect(() => {
    setShowContinueButton(true);
  }, []);

  const handleContinue = () => {
    console.log('🚀 User clicked to start lesson');
    onActivityComplete();
  };

  const introText = `${activity.title}. ${activity.content.hook || 'Welcome to your lesson!'}`;

  return (
    <TextWithSpeaker
      text={introText}
      context="activity-introduction"
      position="corner"
      showOnHover={false}
    >
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-gray-700">
        <CardContent className="p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{activity.title}</h2>
          <p className="text-xl mb-6 text-gray-200">
            {activity.content.hook || 'Welcome to your lesson!'}
          </p>
          
          {showContinueButton && (
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3"
            >
              Start Lesson
            </Button>
          )}
          
          {!showContinueButton && (
            <div className="text-gray-300">
              Loading...
            </div>
          )}
        </CardContent>
      </Card>
    </TextWithSpeaker>
  );
};

export default ActivityIntroduction;
