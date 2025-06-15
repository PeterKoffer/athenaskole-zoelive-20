import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Home } from 'lucide-react';

interface IntroductionControlsProps {
  hasStarted: boolean;
  canProceedWithoutSpeech: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  isComplete: boolean;
  hasUserInteracted: boolean;
  onManualStart: () => void;
  onProceedWithoutSpeech: () => void;
  onToggleEnabled: () => void;
  onManualRead: () => void;
  onIntroductionComplete: () => void;
  onStartLesson: () => void;
  onSkip: () => void;
  onHome?: () => void;
}

const IntroductionControls = ({
  hasStarted,
  canProceedWithoutSpeech,
  isEnabled,
  isSpeaking,
  isComplete,
  hasUserInteracted,
  onManualStart,
  onProceedWithoutSpeech,
  onToggleEnabled,
  onManualRead,
  onIntroductionComplete,
  onStartLesson,
  onSkip,
  onHome
}: IntroductionControlsProps) => {
  if (!hasStarted) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Only Home, Start Introduction, and Start Lesson Without Speech buttons */}
        <Button
          variant="outline"
          className="border-gray-400 text-gray-200 bg-gray-800/50 px-6 py-3"
          onClick={onHome}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          onClick={onManualStart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Introduction with Nelie
        </Button>
        {canProceedWithoutSpeech && (
          <Button
            onClick={onProceedWithoutSpeech}
            variant="outline"
            className="border-gray-400 text-gray-200 bg-gray-800/50 px-6 py-3"
          >
            Start Lesson Without Speech
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={onToggleEnabled}
        className="border-purple-400 text-purple-200 bg-purple-800/50"
      >
        {isEnabled ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
        {isEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
      </Button>
      <Button
        variant="outline"
        onClick={onManualRead}
        className="border-purple-400 text-purple-200 bg-purple-800/50"
        disabled={!isEnabled && hasUserInteracted}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        {isSpeaking ? 'Stop Reading' : 'Read Again'}
      </Button>
      {isComplete ? (
        <Button
          onClick={onIntroductionComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Start Class
        </Button>
      ) : (
        <>
          {(isSpeaking || hasStarted) && (
            <Button
              onClick={onStartLesson}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Start Lesson
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onSkip}
            className="border-gray-400 text-gray-200 bg-gray-800/50"
          >
            Skip Introduction
          </Button>
        </>
      )}
    </>
  );
};

export default IntroductionControls;
