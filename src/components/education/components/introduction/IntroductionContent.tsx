
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
      {/* Soft blackboard-like message */}
      <div
        className="rounded-lg p-6 mb-6 border-[2.5px] border-[#267346] shadow-2xl"
        style={{
          background: "rgba(20, 22, 24, 0.80)", // softer, slightly see-through black
          boxShadow: "0 6px 36px 6px rgba(20,22,24,0.35), 0 0 0 4px #0d2712 inset",
        }}
      >
        <h3 className="text-xl font-semibold text-white mb-3">Welcome to Class</h3>
        <p className="text-gray-100 leading-relaxed text-lg">{currentStepText}</p>
        {/* Progress indicator */}
        <div className="flex items-center space-x-2 mt-4 mb-1">
          <div className="text-green-200 text-xs font-medium">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="flex-1 bg-[#1b2621] rounded-full h-2">
            <div 
              className="bg-[#38e992] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => {
            console.log('🔊 Sound toggle clicked in introduction');
            onMuteToggle();
          }}
          variant="outline"
          className="border-green-400 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
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
          className="border-green-400 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
          disabled={isSpeaking}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isSpeaking ? 'Nelie is Speaking...' : 'Ask Nelie to Repeat'}
        </Button>
      </div>
      {isIntroductionComplete && (
        <div className="mt-6 text-center">
          <div className="text-green-200 text-sm mb-3">
            Introduction complete! Starting lesson in 3 seconds...
          </div>
          <Button
            onClick={onStartLesson}
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Start Lesson Now
          </Button>
        </div>
      )}
    </>
  );
};

export default IntroductionContent;

