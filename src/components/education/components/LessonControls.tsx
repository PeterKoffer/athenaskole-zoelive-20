import UnifiedLessonControls from './UnifiedLessonControls';
import { QuestionLessonControlsProps } from './interfaces/LessonControlsTypes';

interface LessonControlsProps {
  showResult: boolean;
  selectedAnswer: number | null;
  isLastQuestion: boolean;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  disabled?: boolean;
}

const LessonControls = (props: LessonControlsProps) => {
  const unifiedProps: QuestionLessonControlsProps = {
    showResult: props.showResult,
    selectedAnswer: props.selectedAnswer,
    isLastQuestion: props.isLastQuestion,
    onSubmitAnswer: props.onSubmitAnswer,
    onNextQuestion: props.onNextQuestion,
    disabled: props.disabled
  };

  return <UnifiedLessonControls {...unifiedProps} />;
};

export default LessonControls;
