
import ActivityExplanation from './ActivityExplanation';
import ActivityQuestion from './ActivityQuestion';
import ActivityGame from './ActivityGame';

interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number;
  content: any;
}

interface LessonActivityRendererProps {
  currentActivity: LessonActivity;
  selectedAnswer: number | null;
  showResult: boolean;
  activityCompleted: boolean;
  onAnswerSelect: (answerIndex: number) => void;
  onManualContinue: () => void;
}

const LessonActivityRenderer = ({
  currentActivity,
  selectedAnswer,
  showResult,
  activityCompleted,
  onAnswerSelect,
  onManualContinue
}: LessonActivityRendererProps) => {
  if (currentActivity.type === 'explanation') {
    return (
      <ActivityExplanation
        title={currentActivity.title}
        content={currentActivity.content}
        activityCompleted={activityCompleted}
        onContinue={onManualContinue}
      />
    );
  }

  if (currentActivity.type === 'question') {
    return (
      <ActivityQuestion
        title={currentActivity.title}
        content={currentActivity.content}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        activityCompleted={activityCompleted}
        onAnswerSelect={onAnswerSelect}
      />
    );
  }

  if (currentActivity.type === 'game') {
    return (
      <ActivityGame
        title={currentActivity.title}
        content={currentActivity.content}
        activityCompleted={activityCompleted}
        onContinue={onManualContinue}
      />
    );
  }

  return null;
};

export default LessonActivityRenderer;
