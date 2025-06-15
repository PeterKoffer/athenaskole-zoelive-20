
import { LessonActivity } from './types/LessonTypes';
import ActivityIntroduction from './activities/ActivityIntroduction';
import ActivityContentDelivery from './activities/ActivityContentDelivery';
import ActivityInteractiveGame from './activities/ActivityInteractiveGame';
import ActivityFallback from './activities/ActivityFallback';
import ActivityPuzzle from './activities/ActivityPuzzle';
import ActivityMiniGame from './activities/ActivityMiniGame';
import ActivityAdventureGame from './activities/ActivityAdventureGame';
import ActivityPuzzleQuest from './activities/ActivityPuzzleQuest';
import ActivityInteractiveQuiz from './activities/ActivityInteractiveQuiz';
import ActivitySimulationGame from './activities/ActivitySimulationGame';

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

  // NEW ENGAGING ACTIVITY TYPES - Check for these first!
  if (activity.content?.battleScenario || activity.title.includes('Battle') || activity.title.includes('Arena')) {
    return (
      <ActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  if (activity.content?.simulationDescription || activity.title.includes('Factory') || activity.title.includes('Shop')) {
    return (
      <ActivitySimulationGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

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

  // Quiz-based activities (Math Battle Arena, Sports Statistics, etc.)
  if (activity.type === 'quiz' || activity.content?.question) {
    return (
      <ActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Simulation-based activities (Pizza Factory, etc.)
  if (activity.type === 'simulation' || activity.content?.scenarios) {
    return (
      <ActivitySimulationGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Render based on activity phase
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
