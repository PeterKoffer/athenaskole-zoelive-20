
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

  // PRIORITY 1: Check for Pizza Factory and similar simulation games FIRST
  if (activity.title.includes('Pizza') || activity.title.includes('Factory') || 
      activity.content?.simulationDescription || activity.content?.scenarios ||
      activity.type === 'simulation' || activity.phase === 'simulation') {
    console.log('🍕 Rendering Pizza Factory as simulation game');
    return (
      <ActivitySimulationGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // PRIORITY 2: Battle/Arena activities - check for quiz type instead of phase
  if (activity.title?.includes('Battle') || activity.title?.includes('Arena') || 
      activity.title?.includes('Quiz') || activity.title?.includes('Challenge') ||
      activity.content?.battleScenario || activity.type === 'quiz') {
    console.log('🎮 Rendering as interactive quiz for battle/arena activity');
    return (
      <ActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // PRIORITY 3: Other simulation games
  if (activity.title.includes('Shop')) {
    return (
      <ActivitySimulationGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Adventure games
  if (activity.content?.gameType === 'adventure-game' || activity.title.includes('Adventure') ||
      activity.type === 'adventure-game' || activity.phase === 'adventure-game') {
    return (
      <ActivityAdventureGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Puzzle quests
  if (activity.content?.gameType === 'puzzle-quest' || activity.title.includes('Puzzle Quest') || 
      activity.title.includes('Mystery')) {
    return (
      <ActivityPuzzleQuest
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Interactive game type - this should handle most math activities
  if (activity.type === 'interactive-game' || activity.phase === 'interactive-game') {
    console.log('🎮 Rendering as interactive game');
    return (
      <ActivityInteractiveGame
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Activities with questions (but not necessarily quiz type)
  if (activity.content?.question) {
    return (
      <ActivityInteractiveQuiz
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

  // Default fallback - but make it more interactive
  console.log('⚠️ Using fallback renderer for activity:', activity.title);
  return (
    <ActivityInteractiveGame
      activity={activity}
      onActivityComplete={onActivityComplete}
    />
  );
};

export default EnhancedActivityRenderer;
