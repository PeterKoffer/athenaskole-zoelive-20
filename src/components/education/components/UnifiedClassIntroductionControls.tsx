import { Button } from '@/components/ui/button';
import { Play, Home, Repeat } from 'lucide-react';

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
  // Button stylings for consistent modern alignment.
  // First row for sound/repeat, second for progression actions.

  if (!hasStarted) {
    return (
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        {/* --- First Row: Sound & Repeat --- */}
        <div className="flex flex-row gap-4 justify-center w-full max-w-xl">
          <Button
            type="button"
            variant="outline"
            onClick={toggleEnabled}
            className={`min-w-[180px] py-3 font-medium border-green-400 
              text-black bg-white hover:bg-gray-100 hover:text-black 
              flex items-center justify-center shadow-sm`}
          >
            {isEnabled ? (
              <>
                <span className="mr-2"><span className="inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zm7.31 2.71a9 9 0 0 1 0 12.73M19 5l-14 14"/>
                </svg></span></span>
                Sound Off
              </>
            ) : (
              <>
                <span className="mr-2"><span className="inline-block"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19 13V11a4 4 0 0 0-4-4"/><path d="M19 19V5"/></svg></span></span>
                Sound Off
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleManualRead}
            className="min-w-[180px] py-3 font-medium border-green-400 text-black bg-white hover:bg-gray-100 hover:text-black flex items-center justify-center shadow-sm"
            disabled={(!isEnabled && hasUserInteracted) || isAdvancing}
          >
            <span className="mr-2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="17 1 21 5 17 9"/><rect x="3" y="4" width="7" height="16" rx="2"/><path d="M14 4v16"/></svg></span>
            Ask Nelie to Repeat
          </Button>
        </div>
        {/* --- Second row: Progression controls --- */}
        <div className="flex flex-row gap-4 justify-center w-full max-w-xl">
          <Button
            type="button"
            variant="outline"
            onClick={handleManualRead}
            className="min-w-[135px] py-3 font-medium border-purple-400 text-purple-200 bg-gray-800/50 flex items-center justify-center"
            disabled={(!isEnabled && hasUserInteracted) || isAdvancing}
          >
            <span className="mr-2"><Play className="w-4 h-4" /></span>
            Repeat
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-w-[110px] py-3 font-medium border-gray-400 text-gray-200 bg-gray-800/50 flex items-center justify-center"
            onClick={handleHome}
            disabled={isAdvancing}
          >
            <span className="mr-2"><Home className="w-4 h-4" /></span>
            Home
          </Button>
          <Button
            type="button"
            onClick={handleManualStart}
            className="min-w-[250px] py-3 font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
            disabled={isAdvancing}
          >
            <span className="mr-2"><Play className="w-4 h-4" /></span>
            Start Introduction with Nelie
          </Button>
        </div>
        {/* --- Third (full-width under row): Start Without Speech --- */}
        <div className="w-full flex justify-center mt-2">
          <Button
            type="button"
            onClick={handleProceedWithoutSpeech}
            variant="outline"
            className="w-[400px] max-w-full py-3 font-medium border-gray-400 text-gray-200 bg-gray-800/50 flex items-center justify-center"
            disabled={!canProceedWithoutSpeech || isAdvancing}
          >
            Start Lesson Without Speech
          </Button>
        </div>
      </div>
    );
  }

  // Advanced/started state (unchanged layout)
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
