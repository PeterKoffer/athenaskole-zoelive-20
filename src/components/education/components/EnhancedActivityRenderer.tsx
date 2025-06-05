
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

  // Timer for activity duration - reduced timing for faster flow
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => onActivityComplete(), 200); // Reduced delay
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset timer when activity changes - with faster timing
  useEffect(() => {
    // Reduce welcome and explanation durations for faster lesson start
    const adjustedDuration = activity.type === 'welcome' ? 5 : 
                            activity.type === 'explanation' ? 8 : 
                            activity.duration;
    setTimeRemaining(adjustedDuration);
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
