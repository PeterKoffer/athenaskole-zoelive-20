
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

  // Enhanced timer for accelerated learning - optimized for 15-18 minute lessons
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => onActivityComplete(), 300); // Even smoother transition
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset timer with enhanced durations for faster learning
  useEffect(() => {
    let adjustedDuration = activity.duration;
    
    if (activity.type === 'welcome') {
      adjustedDuration = 3; // Even quicker welcome to start learning faster
    } else if (activity.type === 'explanation') {
      adjustedDuration = 6; // Reduced time but still effective for understanding
    } else if (activity.type === 'question') {
      adjustedDuration = 20; // Adequate time for thinking while maintaining pace
    } else if (activity.type === 'game') {
      adjustedDuration = 25; // Balanced time for interactive learning
    }
    
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
    case 'game':
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
