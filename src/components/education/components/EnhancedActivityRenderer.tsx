
import { useState, useEffect, useRef } from 'react';
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
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activityIdRef = useRef(activity.id);

  console.log('🎬 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityPhase: activity.phase,
    activityTitle: activity.title,
    isCompleted,
    hasAnswered
  });

  // Reset state when activity changes
  useEffect(() => {
    if (activityIdRef.current !== activity.id) {
      console.log('🔄 Activity changed, resetting state:', activity.id);
      activityIdRef.current = activity.id;
      setTimeRemaining(activity.duration);
      setHasAnswered(false);
      setIsCompleted(false);
    }
  }, [activity.id, activity.duration]);

  // Timer management - only for non-interactive activities
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Don't start timer if already completed
    if (isCompleted) {
      return;
    }

    // Only auto-advance for specific phases
    const shouldAutoAdvance = (
      activity.phase === 'introduction' || 
      activity.phase === 'content-delivery' || 
      activity.phase === 'summary'
    ) && !hasAnswered;

    if (shouldAutoAdvance) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1 && !isCompleted) {
            console.log('⏱️ Timer completed for phase:', activity.phase);
            setIsCompleted(true);
            setTimeout(() => {
              onActivityComplete();
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activity.phase, activity.id, hasAnswered, isCompleted, onActivityComplete]);

  const handleContinue = () => {
    if (isCompleted) return;
    
    console.log('➡️ Manual continue for phase:', activity.phase);
    setIsCompleted(true);
    onActivityComplete();
  };

  const handleAnswerSubmit = (wasCorrect: boolean) => {
    if (isCompleted) return;
    
    console.log('✅ Answer submitted for phase:', activity.phase, 'Correct:', wasCorrect);
    setHasAnswered(true);
    setIsCompleted(true);
    
    // Clear timer since user has answered
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    onActivityComplete(wasCorrect);
  };

  // Prevent rendering if completed to avoid race conditions
  if (isCompleted) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
