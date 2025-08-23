
import LessonProgressHeader from '../LessonProgressHeader';

interface LessonProgressDisplayProps {
  currentActivityIndex: number;
  totalActivities: number;
  sessionTimer: number;
  targetLessonLength: number;
  score: number;
  correctStreak: number;
  onBackToProgram: () => void;
  hideActivityCount?: boolean;
}

const LessonProgressDisplay = ({
  currentActivityIndex,
  totalActivities,
  sessionTimer,
  targetLessonLength,
  score,
  correctStreak,
  onBackToProgram,
  hideActivityCount
}: LessonProgressDisplayProps) => {
  return (
    <LessonProgressHeader
      currentActivityIndex={currentActivityIndex}
      totalActivities={totalActivities}
      timeElapsed={sessionTimer}
      targetLessonLength={targetLessonLength}
      score={score}
      correctStreak={correctStreak}
      engagementLevel={85}
      questionsGenerated={totalActivities}
      onBackToProgram={onBackToProgram}
      hideActivityCount={hideActivityCount}
    />
  );
};

export default LessonProgressDisplay;
