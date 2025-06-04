
import IntroductionSteps from './IntroductionSteps';
import ProgressIndicator from './ProgressIndicator';
import IntroductionControls from './IntroductionControls';

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
      <IntroductionSteps currentStepText={currentStepText} />
      
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
      />
      
      <IntroductionControls
        autoReadEnabled={autoReadEnabled}
        isSpeaking={isSpeaking}
        isIntroductionComplete={isIntroductionComplete}
        onMuteToggle={onMuteToggle}
        onManualRead={onManualRead}
        onStartLesson={onStartLesson}
      />
    </>
  );
};

export default IntroductionContent;
