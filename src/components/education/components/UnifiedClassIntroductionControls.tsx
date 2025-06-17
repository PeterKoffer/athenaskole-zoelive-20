import { Button } from '@/components/ui/button';
import { Home, Play } from 'lucide-react';

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
  // Only 3 buttons now: Home, Start Introduction with Nelie, Start Lesson Without Speech

  if (!hasStarted) {
    return (
      <div className="w-full flex justify-center mt-8">
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full max-w-3xl justify-center">
          {/* Home */}
          <Button
            type="button"
            variant="outline"
            className="h-10 px-3 font-medium border-gray-400 text-gray-200 bg-gray-800/60 hover:bg-gray-700 flex items-center justify-center text-sm transition-none"
            onClick={handleHome}
            disabled={isAdvancing}
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Home</span>
          </Button>

          {/* Start Introduction with Nelie */}
          <Button
            type="button"
            onClick={handleManualStart}
            className="h-10 px-4 font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center text-sm transition-none"
            disabled={isAdvancing}
            style={{
              letterSpacing: '0.01em',
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">Start Introduction with Nelie</span>
          </Button>

          {/* Start Lesson Without Speech */}
          <Button
            type="button"
            onClick={handleProceedWithoutSpeech}
            variant="outline"
            className="h-10 px-4 font-bold border-gray-400 text-gray-200 bg-gray-800/60 hover:bg-gray-700 flex items-center justify-center text-sm transition-none"
            disabled={!canProceedWithoutSpeech || isAdvancing}
            style={{
              letterSpacing: '0.01em',
            }}
          >
            <span className="whitespace-nowrap">Start Lesson Without Speech</span>
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
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
