
import { LessonActivity } from './types/LessonTypes';
import StableActivityInteractiveQuiz from './activities/StableActivityInteractiveQuiz';
import ActivityContentDelivery from './activities/ActivityContentDelivery';

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

  // Handle content-delivery activities
  if (activity.type === 'content-delivery' || activity.phase === 'content-delivery') {
    console.log('📚 Rendering content-delivery activity');
    return (
      <ActivityContentDelivery
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle interactive quiz activities
  if (activity.type === 'interactive-game' || activity.phase === 'interactive-game') {
    return (
      <StableActivityInteractiveQuiz
        activity={activity}
        onActivityComplete={onActivityComplete}
      />
    );
  }

  // Handle introduction activities
  if (activity.type === 'introduction' || activity.phase === 'introduction') {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-semibold mb-4">{activity.title}</h3>
        <div className="text-gray-300 mb-6 text-lg leading-relaxed">
          {activity.content?.text || activity.phaseDescription || "Welcome to your learning adventure!"}
        </div>
        <button
          onClick={() => onActivityComplete(true)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded text-white font-bold text-lg"
        >
          Let's Begin!
        </button>
      </div>
    );
  }

  // Fallback - convert any unsupported type to interactive quiz
  console.log('⚠️ Converting unsupported activity type to interactive quiz:', activity.type);
  return (
    <StableActivityInteractiveQuiz
      activity={activity}
      onActivityComplete={onActivityComplete}
    />
  );
};

export default StableEnhancedActivityRenderer;
