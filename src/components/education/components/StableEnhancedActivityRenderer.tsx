
import { LessonActivity } from './types/LessonTypes';
import StableActivityInteractiveQuiz from './activities/StableActivityInteractiveQuiz';

interface StableEnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady?: boolean;
}

const StableEnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady = true
}: StableEnhancedActivityRendererProps) => {
  console.log('🎯 StableEnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    isNelieReady
  });

  // Use the stable interactive quiz component
  if (activity.type === 'interactive-game' || activity.phase === 'interactive-game') {
    return (
      <StableActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Fallback for other activity types
  return (
    <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
      <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
      <p className="text-gray-300 mb-6">
        Activity type "{activity.type}" with phase "{activity.phase}" is not yet supported in stable mode.
      </p>
      <button
        onClick={() => onActivityComplete(true)}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-bold"
      >
        Continue
      </button>
    </div>
  );
};

export default StableEnhancedActivityRenderer;
