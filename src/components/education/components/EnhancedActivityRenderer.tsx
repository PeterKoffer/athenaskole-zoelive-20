
import { useState, useEffect } from 'react';
import { LessonActivity } from './EnhancedLessonContent';
import ActivityWelcome from './activities/ActivityWelcome';
import ActivityExplanation from './activities/ActivityExplanation';
import ActivityQuestion from './activities/ActivityQuestion';

interface EnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady: boolean;
}

const EnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady
}: EnhancedActivityRendererProps) => {
  const [timeRemaining, setTimeRemaining] = useState(activity.duration);

  // Timer for activity duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => onActivityComplete(), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset timer when activity changes
  useEffect(() => {
    setTimeRemaining(activity.duration);
  }, [activity]);

  const handleContinue = () => {
    onActivityComplete();
  };

  switch (activity.type) {
    case 'welcome':
      return (
        <ActivityWelcome 
          activity={activity} 
          timeRemaining={timeRemaining} 
          isNelieReady={isNelieReady} 
        />
      );
    
    case 'explanation':
      return (
        <ActivityExplanation 
          activity={activity} 
          timeRemaining={timeRemaining} 
          onActivityComplete={handleContinue} 
        />
      );
    
    case 'question':
      return (
        <ActivityQuestion 
          activity={activity} 
          timeRemaining={timeRemaining} 
          onActivityComplete={onActivityComplete} 
        />
      );
    
    default:
      return (
        <ActivityExplanation 
          activity={activity} 
          timeRemaining={timeRemaining} 
          onActivityComplete={handleContinue} 
        />
      );
  }
};

export default EnhancedActivityRenderer;
