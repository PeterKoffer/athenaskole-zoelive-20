
import { LessonActivity } from './types/LessonTypes';
import ActivityIntroduction from './activities/ActivityIntroduction';
import ActivityContentDelivery from './activities/ActivityContentDelivery';
import ActivityInteractiveGame from './activities/ActivityInteractiveGame';
import ActivityFallback from './activities/ActivityFallback';
import ActivityPuzzle from './activities/ActivityPuzzle';
import ActivityMiniGame from './activities/ActivityMiniGame';
import ActivityAdventureGame from './activities/ActivityAdventureGame';
import ActivityPuzzleQuest from './activities/ActivityPuzzleQuest';

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

  // NEW ENGAGING ACTIVITY TYPES - Check for these first!
  if (activity.content?.gameType === 'adventure-game' || activity.title.includes('Adventure')) {
    return (
      <ActivityAdventureGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  if (activity.content?.gameType === 'puzzle-quest' || activity.title.includes('Puzzle Quest') || activity.title.includes('Mystery')) {
    return (
      <ActivityPuzzleQuest
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Legacy specific game/puzzle types
  if (activity.content?.puzzleDescription && !activity.title.includes('Quest')) {
    return (
      <ActivityPuzzle
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  if (activity.content?.gameDescription && !activity.title.includes('Adventure')) {
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
