
import { LessonActivity } from './types/LessonTypes';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';

interface LessonActivityManagerProps {
  activities: LessonActivity[];
  currentActivityIndex: number;
  score: number;
  onActivityComplete: (wasCorrect?: boolean) => void;
  onScoreUpdate: (score: number) => void;
}

const LessonActivityManager = ({
  activities,
  currentActivityIndex,
  score,
  onActivityComplete,
  onScoreUpdate
}: LessonActivityManagerProps) => {
  const currentActivity = activities[currentActivityIndex];

  console.log('🎮 LessonActivityManager rendering:', {
    currentActivityIndex,
    totalActivities: activities.length,
    currentActivity: currentActivity?.title,
    currentActivityType: currentActivity?.type
  });

  if (!currentActivity) {
    console.warn('⚠️ No current activity found');
    return (
      <div className="text-center text-white p-8">
        <p>No activity available at index {currentActivityIndex}</p>
        <p>Total activities: {activities.length}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <EnhancedActivityRenderer
        activity={currentActivity}
        onActivityComplete={onActivityComplete}
        isNelieReady={true}
      />
    </div>
  );
};

export default LessonActivityManager;
