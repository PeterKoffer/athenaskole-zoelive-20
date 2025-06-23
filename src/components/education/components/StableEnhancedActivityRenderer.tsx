
import { LessonActivity } from './types/LessonTypes';
import EnhancedActivityRenderer from './activities/EnhancedActivityRenderer';

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

  return (
    <EnhancedActivityRenderer
      activity={activity}
      onActivityComplete={onActivityComplete}
      isNelieReady={isNelieReady}
    />
  );
};

export default StableEnhancedActivityRenderer;
