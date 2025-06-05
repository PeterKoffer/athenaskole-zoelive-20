
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

  // Timer for activity duration - optimized for 20-25 minute lessons
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => onActivityComplete(), 500); // Smooth transition
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset timer when activity changes - with optimal timing for engagement
  useEffect(() => {
    // Balanced durations for comprehensive learning experience
    let adjustedDuration = activity.duration;
    
    if (activity.type === 'welcome') {
      adjustedDuration = 4; // Quick welcome to start learning faster
    } else if (activity.type === 'explanation') {
      adjustedDuration = 8; // Sufficient time for understanding concepts
    } else if (activity.type === 'question') {
      adjustedDuration = 25; // Adequate time for thinking and answering
    } else if (activity.type === 'game') {
      adjustedDuration = 30; // Extra time for interactive fun
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
