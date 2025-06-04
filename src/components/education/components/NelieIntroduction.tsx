
import { Card, CardContent } from '@/components/ui/card';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import IntroductionSteps from './IntroductionSteps';
import ProgressIndicator from './ProgressIndicator';
import IntroductionControls from './IntroductionControls';
import { useIntroductionFlow } from './hooks/useIntroductionFlow';

interface NelieIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const NelieIntroduction = ({
  subject,
  skillArea,
  onIntroductionComplete
}: NelieIntroductionProps) => {
  const {
    currentStep,
    introductionSteps,
    isSpeaking,
    autoReadEnabled,
    handleMuteToggle,
    handleManualRead,
    stopSpeaking
  } = useIntroductionFlow(subject);

  const handleStartLesson = () => {
    stopSpeaking();
    onIntroductionComplete();
  };

  const isIntroductionComplete = currentStep >= introductionSteps.length - 1;
  const currentStepText = introductionSteps[currentStep]?.text || '';

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <RobotAvatar size="4xl" isActive={true} isSpeaking={isSpeaking} />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to {subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie!
          </h1>
          
          <IntroductionSteps currentStepText={currentStepText} />
          
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={introductionSteps.length} 
          />
          
          <IntroductionControls
            autoReadEnabled={autoReadEnabled}
            isSpeaking={isSpeaking}
            isIntroductionComplete={isIntroductionComplete}
            onMuteToggle={handleMuteToggle}
            onManualRead={handleManualRead}
            onStartLesson={handleStartLesson}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NelieIntroduction;
