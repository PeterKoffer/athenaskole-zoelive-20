
import { useState, useEffect } from 'react';
import { LessonActivity } from './types/LessonTypes';
import ActivityIntroduction from './activities/ActivityIntroduction';
import ActivityContentDelivery from './activities/ActivityContentDelivery';
import ActivityInteractiveGame from './activities/ActivityInteractiveGame';
import ActivityApplication from './activities/ActivityApplication';
import ActivityCreativeExploration from './activities/ActivityCreativeExploration';
import ActivitySummary from './activities/ActivitySummary';

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
  const [hasAnswered, setHasAnswered] = useState(false);

  console.log('🎬 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityPhase: activity.phase,
    activityTitle: activity.title,
    duration: activity.duration,
    isNelieReady,
    hasContent: !!activity.content.question
  });

  // Timer for each phase
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Only auto-advance for non-interactive phases
          if (!hasAnswered && (
            activity.phase === 'introduction' || 
            activity.phase === 'content-delivery' || 
            activity.phase === 'summary'
          )) {
            setTimeout(() => {
              console.log('⏱️ Auto-advancing from phase:', activity.phase);
              onActivityComplete();
            }, 200);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete, hasAnswered]);

  // Reset timer and answer state when activity changes
  useEffect(() => {
    console.log('⏰ Setting timer for phase:', {
      activityId: activity.id,
      phase: activity.phase,
      duration: activity.duration
    });
    
    setTimeRemaining(activity.duration);
    setHasAnswered(false);
  }, [activity]);

  const handleContinue = () => {
    console.log('➡️ Manual continue for phase:', activity.phase);
    onActivityComplete();
  };

  const handleAnswerSubmit = (wasCorrect: boolean) => {
    console.log('✅ Answer submitted for phase:', activity.phase, 'Correct:', wasCorrect);
    setHasAnswered(true);
    onActivityComplete(wasCorrect);
  };

  switch (activity.phase) {
    case 'introduction':
      return (
        <ActivityIntroduction 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
          isNelieReady={isNelieReady} 
        />
      );
    
    case 'content-delivery':
      return (
        <ActivityContentDelivery 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
          onAnswerSubmit={handleAnswerSubmit}
        />
      );
    
    case 'interactive-game':
      return (
        <ActivityInteractiveGame 
          activity={activity} 
          timeRemaining={timeRemaining}
          onAnswerSubmit={handleAnswerSubmit}
        />
      );
    
    case 'application':
      return (
        <ActivityApplication 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
        />
      );
    
    case 'creative-exploration':
      return (
        <ActivityCreativeExploration 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
        />
      );
    
    case 'summary':
      return (
        <ActivitySummary 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
          onAnswerSubmit={handleAnswerSubmit}
        />
      );
    
    default:
      console.warn('⚠️ Unknown activity phase:', activity.phase);
      return (
        <ActivityContentDelivery 
          activity={activity} 
          timeRemaining={timeRemaining}
          onContinue={handleContinue}
          onAnswerSubmit={handleAnswerSubmit}
        />
      );
  }
};

export default EnhancedActivityRenderer;
