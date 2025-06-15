import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
  return (
    <>
      <LessonControlsFooter
        adaptiveSpeed={1.0}
        onResetProgress={onRegenerate}
      />

      <div className="text-center">
        <Button 
          onClick={onRegenerate}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Lesson
        </Button>
      </div>
    </>
  );
};

export default LessonControls;
