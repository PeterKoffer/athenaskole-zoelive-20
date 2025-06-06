
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

  console.log('🎬 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityTitle: activity.title,
    duration: activity.duration,
    isNelieReady
  });

  // Optimized timer for 20-minute lessons with smooth progression
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => {
              console.log('⏱️ Auto-advancing from:', activity.type);
              onActivityComplete();
            }, 200);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset timer with optimized durations for 20-minute lessons
  useEffect(() => {
    let adjustedDuration = activity.duration;
    
    // Optimize timing for engaging 20-minute experience
    if (activity.type === 'welcome') {
      adjustedDuration = 5; // Quick welcome to start learning
    } else if (activity.type === 'explanation') {
      adjustedDuration = 8; // Sufficient time for understanding concepts
    } else if (activity.type === 'question') {
      adjustedDuration = 25; // Adequate thinking time without dragging
    } else if (activity.type === 'game') {
      adjustedDuration = 30; // Interactive learning time
    }
    
    console.log('⏰ Setting timer for activity:', {
      activityId: activity.id,
      type: activity.type,
      originalDuration: activity.duration,
      adjustedDuration
    });
    
    setTimeRemaining(adjustedDuration);
  }, [activity]);

  const handleContinue = () => {
    console.log('➡️ Manual continue for activity:', activity.id);
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
      console.warn('⚠️ Unknown activity type:', activity.type);
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
