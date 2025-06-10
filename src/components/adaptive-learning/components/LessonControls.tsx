import UnifiedLessonControls from '../../education/components/UnifiedLessonControls';
import { SessionLessonControlsProps } from '../../education/components/interfaces/LessonControlsTypes';

interface LessonControlsProps {
  isSessionActive: boolean;
  onToggleSession: () => void;
  onNextQuestion?: () => void;
  canSkip: boolean;
  showSkip?: boolean;
}

const LessonControls = (props: LessonControlsProps) => {
  const unifiedProps: SessionLessonControlsProps = {
    isSessionActive: props.isSessionActive,
    onToggleSession: props.onToggleSession,
    onNextQuestion: props.onNextQuestion,
    canSkip: props.canSkip,
    showSkip: props.showSkip
  };

  return <UnifiedLessonControls {...unifiedProps} />;
};

export default LessonControls;
