import { Button } from '@/components/ui/button';
import { Repeat, Home, Play } from 'lucide-react';

interface UnifiedClassIntroductionControlsProps {
  hasStarted: boolean;
  canProceedWithoutSpeech: boolean;
  isEnabled: boolean;
  isSpeaking: boolean;
  isComplete: boolean;
  hasUserInteracted: boolean;
  handleManualStart: () => void;
  handleManualRead: () => void;
  toggleEnabled: () => void;
  onIntroductionComplete: () => void;
  handleStartLesson: () => void;
  handleSkip: () => void;
  handleHome: () => void;
  handleProceedWithoutSpeech: () => void;
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
  handleManualRead,
  toggleEnabled,
  onIntroductionComplete,
  handleStartLesson,
  handleSkip,
  handleHome,
  handleProceedWithoutSpeech,
  isAdvancing = false,
}: UnifiedClassIntroductionControlsProps) => {
  // Render only the required 4 buttons in a single row, responsive

  if (!hasStarted) {
    return (
      <div className="w-full flex justify-center mt-8">
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full max-w-2xl justify-center">
          {/* Repeat (ask Nelie to repeat) */}
          <Button
            type="button"
            variant="outline"
            onClick={handleManualRead}
            className="min-w-[100px] sm:min-w-[120px] px-3 py-2 font-medium border-purple-400 text-purple-200 bg-gray-800/60 hover:bg-gray-700 flex items-center justify-center text-sm"
            disabled={(!isEnabled && hasUserInteracted) || isAdvancing}
          >
            <Repeat className="w-4 h-4 mr-1" />
            Repeat
          </Button>

          {/* Home */}
          <Button
            type="button"
            variant="outline"
            className="min-w-[100px] sm:min-w-[120px] px-3 py-2 font-medium border-gray-400 text-gray-200 bg-gray-800/60 hover:bg-gray-700 flex items-center justify-center text-sm"
            onClick={handleHome}
            disabled={isAdvancing}
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Button>

          {/* Start Introduction with Nelie */}
          <Button
            type="button"
            onClick={handleManualStart}
            className="min-w-[140px] sm:min-w-[180px] px-3 py-2 font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-sm"
            disabled={isAdvancing}
          >
            <Play className="w-4 h-4 mr-1" />
            Start Introduction with Nelie
          </Button>

          {/* Start Lesson Without Speech */}
          <Button
            type="button"
            onClick={handleProceedWithoutSpeech}
            variant="outline"
            className="min-w-[170px] px-3 py-2 font-medium border-gray-400 text-gray-200 bg-gray-800/60 hover:bg-gray-700 flex items-center justify-center text-sm"
            disabled={!canProceedWithoutSpeech || isAdvancing}
          >
            Start Lesson Without Speech
          </Button>
        </div>
      </div>
    );
  }

  // Started state (keep as before, for after intro starts)
  return (
    <div className="mt-6 flex flex-col gap-2 w-full">
      {hasStarted && (
        <div className="flex flex-wrap gap-2 justify-center">
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
                className="border-gray-400 text-gray-200 bg-gray-800/60"
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
