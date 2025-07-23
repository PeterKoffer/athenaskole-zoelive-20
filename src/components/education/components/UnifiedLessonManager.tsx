
import { useOptimizedLessonManager } from './hooks/useOptimizedLessonManager';
import UniversalLearningMainContent from './universal/UniversalLearningMainContent';
import UniversalLearningLoading from './universal/UniversalLearningLoading';

interface UnifiedLessonManagerProps {
  subject: string;
  skillArea: string;
  studentName: string;
  onBackToProgram: () => void;
}

const UnifiedLessonManager = ({
  subject,
  skillArea,
  studentName,
  onBackToProgram
}: UnifiedLessonManagerProps) => {
  const {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute
  } = useOptimizedLessonManager({
    subject,
    skillArea,
    onLessonComplete: onBackToProgram
  });

  if (isInitializing) {
    return <UniversalLearningLoading subject={subject} studentName={studentName} />;
  }

  return (
    <UniversalLearningMainContent
      subject={subject}
      skillArea={skillArea}
      studentName={studentName}
      timeElapsed={timeElapsed}
      targetLessonLength={targetLessonLength}
      score={score}
      currentActivityIndex={currentActivityIndex}
      totalRealActivities={totalRealActivities}
      correctStreak={correctStreak}
      currentActivity={currentActivity}
      isSpeaking={isSpeaking}
      onBackToProgram={onBackToProgram}
      onToggleMute={toggleMute}
      onReadRequest={handleReadRequest}
      onStopSpeaking={toggleMute}
      onActivityComplete={handleActivityComplete}
    />
  );
};

export default UnifiedLessonManager;