
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface IntroductionContentProps {
  currentStepText: string;
  currentStep: number;
  totalSteps: number;
  autoReadEnabled: boolean;
  isSpeaking: boolean;
  isIntroductionComplete: boolean;
  onMuteToggle: () => void;
  onManualRead: () => void;
  onStartLesson: () => void;
}

const IntroductionContent = ({
  currentStepText,
  currentStep,
  totalSteps,
  autoReadEnabled,
  isSpeaking,
  isIntroductionComplete,
  onMuteToggle,
  onManualRead,
  onStartLesson
}: IntroductionContentProps) => {
  return (
    <>
      {/* Nelie's current message */}
      <div className="bg-purple-800/30 rounded-lg p-6 mb-6">
        <div className="text-purple-100 text-lg leading-relaxed mb-4">
          {currentStepText}
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="text-purple-300 text-sm">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex-1 bg-purple-900 rounded-full h-2">
            <div 
              className="bg-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced buttons with proper interaction handling */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => {
            console.log('🔊 Sound toggle clicked in introduction');
            onMuteToggle();
          }}
          variant="outline"
          className="border-purple-400 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
        >
          {autoReadEnabled ? (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Sound Off
            </>
          )}
        </Button>
        
        <Button
          onClick={() => {
            console.log('🔊 Ask Nelie to Repeat clicked in introduction');
            onManualRead();
          }}
          variant="outline"
          className="border-purple-400 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
          disabled={isSpeaking}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isSpeaking ? 'Nelie is Speaking...' : 'Ask Nelie to Repeat'}
        </Button>
      </div>

      {/* Auto-advance message when complete */}
      {isIntroductionComplete && (
        <div className="mt-6 text-center">
          <div className="text-purple-200 text-sm mb-3">
            Introduction complete! Starting lesson in 3 seconds...
          </div>
          <Button
            onClick={onStartLesson}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
          >
            Start Lesson Now
          </Button>
        </div>
      )}
    </>
  );
};

export default IntroductionContent;
