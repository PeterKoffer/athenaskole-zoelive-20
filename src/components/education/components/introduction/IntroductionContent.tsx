
import { Button } from '@/components/ui/button';

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
  isIntroductionComplete,
  onStartLesson
}: IntroductionContentProps) => {
  return (
    <>
      {/* The blackboard-like message styling is now handled by the parent component */}
      <h3 className="text-xl font-semibold text-white mb-3 text-center">Welcome to Class</h3>
      <p className="text-gray-100 leading-relaxed text-lg text-center">{currentStepText}</p>
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

      {/* No extra controls; just spacing for visual breathing room */}
      <div className="my-8"></div> 

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
