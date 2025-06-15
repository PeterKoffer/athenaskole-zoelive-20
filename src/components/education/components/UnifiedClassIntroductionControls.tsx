
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';

interface UnifiedClassIntroductionControlsProps {
  hasStarted: boolean;
  canProceedWithoutSpeech: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  isComplete: boolean;
  hasUserInteracted: boolean;
  handleManualStart: () => void;
  handleProceedWithoutSpeech: () => void;
  toggleEnabled: () => void;
  handleManualRead: () => void;
  onIntroductionComplete: () => void;
  handleStartLesson: () => void;
  handleSkip: () => void;
  handleHome: () => void;
  isAdvancing?: boolean;
}

const UnifiedClassIntroductionControls = ({
  hasStarted,
  canProceedWithoutSpeech,
  isEnabled,
  isSpeaking,
  isComplete,
  hasUserInteracted,
  handleManualStart,
  handleProceedWithoutSpeech,
  toggleEnabled,
  handleManualRead,
  onIntroductionComplete,
  handleStartLesson,
  handleSkip,
  handleHome,
  isAdvancing = false,
}: UnifiedClassIntroductionControlsProps) => {
  // All four buttons should display together before the intro has started.
  return (
    <div className="mt-6 flex flex-col gap-2 w-full">
      {!hasStarted && (
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleManualRead}
            className="border-purple-400 text-purple-200 bg-gray-800/50"
            disabled={(!isEnabled && hasUserInteracted) || isAdvancing}
          >
            <span className="flex items-center">
              <span className="mr-2">
                <Play className="w-4 h-4" />
              </span>
              Repeat
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gray-400 text-gray-200 bg-gray-800/50"
            onClick={handleHome}
            disabled={isAdvancing}
          >
            <span className="flex items-center">
              <span className="mr-2">
                <Home className="w-4 h-4" />
              </span>
              Home
            </span>
          </Button>
          <Button
            type="button"
            onClick={handleManualStart}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            disabled={isAdvancing}
          >
            <span className="flex items-center">
              <span className="mr-2">
                <Play className="w-4 h-4" />
              </span>
              Start Introduction with Nelie
            </span>
          </Button>
          <Button
            type="button"
            onClick={handleProceedWithoutSpeech}
            variant="outline"
            className="border-gray-400 text-gray-200 bg-gray-800/50 px-6 py-3"
            disabled={!canProceedWithoutSpeech || isAdvancing}
          >
            Start Lesson Without Speech
          </Button>
        </div>
      )}
      {hasStarted && (
        <div className="flex flex-wrap gap-2">
          {isComplete ? (
            <Button
              type="button"
              onClick={onIntroductionComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={isAdvancing}
            >
              Start Class
            </Button>
          ) : (
            <>
              {(isSpeaking || hasStarted) && (
                <Button
                  type="button"
                  onClick={handleStartLesson}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={isAdvancing}
                >
                  Start Lesson
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="border-gray-400 text-gray-200 bg-gray-800/50"
                disabled={isAdvancing}
              >
                Skip Introduction
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedClassIntroductionControls;
