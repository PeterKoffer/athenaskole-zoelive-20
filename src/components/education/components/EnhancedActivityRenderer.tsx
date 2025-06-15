
import { LessonActivity } from './types/LessonTypes';
import ActivityIntroduction from './activities/ActivityIntroduction';
import ActivityContentDelivery from './activities/ActivityContentDelivery';
import ActivityInteractiveGame from './activities/ActivityInteractiveGame';
import ActivityFallback from './activities/ActivityFallback';
import ActivityPuzzle from './activities/ActivityPuzzle';
import ActivityMiniGame from './activities/ActivityMiniGame';

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
  console.log('🎭 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    activityTitle: activity.title,
    hasContent: !!activity.content,
    contentKeys: activity.content ? Object.keys(activity.content) : []
  });

  // Render based on activity type and phase
  if (activity.phase === 'introduction') {
    return (
      <ActivityIntroduction
        activity={activity}
        onActivityComplete={() => onActivityComplete()}
      />
    );
  }

  if (activity.phase === 'content-delivery') {
    return (
      <ActivityContentDelivery
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Render specific game/puzzle types first
  if (activity.content?.puzzleDescription) {
    return (
      <ActivityPuzzle
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  if (activity.content?.gameDescription) {
    return (
      <ActivityMiniGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  if (activity.phase === 'interactive-game' || activity.type === 'interactive-game') {
    return (
      <ActivityInteractiveGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Default fallback for any other activity type
  return (
    <ActivityFallback
      activity={activity}
      onActivityComplete={() => onActivityComplete()}
    />
  );
};

export default EnhancedActivityRenderer;
