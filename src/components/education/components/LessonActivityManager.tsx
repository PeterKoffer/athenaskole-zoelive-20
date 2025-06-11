
import { useActivityState } from './hooks/useActivityState';
import { useActivitySpeech } from './hooks/useActivitySpeech';
import { useActivityAnswerHandler } from './ActivityAnswerHandler';
import LessonActivityRenderer from './LessonActivityRenderer';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
}

interface LessonActivityManagerProps {
  activities: LessonActivity[];
  currentActivityIndex: number;
  score: number;
  onActivityComplete: () => void;
  onScoreUpdate: (newScore: number) => void;
}

const LessonActivityManager = ({
  activities,
  currentActivityIndex,
  score,
  onActivityComplete,
  onScoreUpdate
}: LessonActivityManagerProps) => {
  const currentActivity = activities[currentActivityIndex];
  
  const {
    selectedAnswer,
    setSelectedAnswer,
    showResult,
    setShowResult,
    activityCompleted,
    setActivityCompleted
  } = useActivityState(currentActivityIndex);

  const {
    stopSpeaking,
    speakText
  } = useActivitySpeech(currentActivity, currentActivityIndex, activityCompleted);

  const { handleAnswerSelect, handleManualContinue } = useActivityAnswerHandler({
    currentActivity,
    showResult,
    activityCompleted,
    score,
    onScoreUpdate,
    onActivityComplete,
    setSelectedAnswer,
    setShowResult,
    setActivityCompleted,
    stopSpeaking,
    speakText
  });

  if (!currentActivity) {
    return null;
  }

  return (
    <LessonActivityRenderer
      currentActivity={currentActivity}
      selectedAnswer={selectedAnswer}
      showResult={showResult}
      activityCompleted={activityCompleted}
      onAnswerSelect={handleAnswerSelect}
      onManualContinue={handleManualContinue}
    />
  );
};

export default LessonActivityManager;
