
import LessonControlsFooter from '../LessonControlsFooter';

interface LessonControlsProps {
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isReady: boolean;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onRegenerate: () => void;
}

const LessonControls = ({
  autoReadEnabled,
  isSpeaking,
  isReady,
  onMuteToggle,
  onManualRead,
  onRegenerate
}: LessonControlsProps) => {
  // Only render the footer (no controls above or banner with the removed buttons)
  return (
    <LessonControlsFooter
      adaptiveSpeed={1.0}
      onResetProgress={onRegenerate}
    />
  );
};

export default LessonControls;

