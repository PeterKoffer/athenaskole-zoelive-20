
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IntroductionHeader from './IntroductionHeader';
import IntroductionContent from './IntroductionContent';
import { useIntroductionFlow } from './hooks/useIntroductionFlow';
import { useEffect } from 'react';

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

  console.log('🎭 NelieIntroduction state:', {
    currentStep,
    totalSteps: introductionSteps.length,
    isSpeaking,
    autoReadEnabled
  });

  const handleStartLesson = () => {
    console.log('🎯 Starting lesson from Nelie introduction');
    stopSpeaking();
    onIntroductionComplete();
  };

  const handleSkipIntroduction = () => {
    console.log('⏭️ Skipping Nelie introduction');
    stopSpeaking();
    onIntroductionComplete();
  };

  // Check if introduction is complete
  const isIntroductionComplete = currentStep >= introductionSteps.length - 1;
  const currentStepText = introductionSteps[currentStep]?.text || '';

  // Auto-advance to lesson after introduction is complete
  useEffect(() => {
    if (isIntroductionComplete) {
      console.log('✅ Introduction complete, auto-advancing to lesson in 3 seconds');
      const timer = setTimeout(() => {
        handleStartLesson();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isIntroductionComplete]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8">
          <IntroductionHeader 
            subject={subject}
            isSpeaking={isSpeaking}
          />
          
          <IntroductionContent
            currentStepText={currentStepText}
            currentStep={currentStep}
            totalSteps={introductionSteps.length}
            autoReadEnabled={autoReadEnabled}
            isSpeaking={isSpeaking}
            isIntroductionComplete={isIntroductionComplete}
            onMuteToggle={handleMuteToggle}
            onManualRead={handleManualRead}
            onStartLesson={handleStartLesson}
          />

          {/* Add skip button for users who don't want the introduction */}
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={handleSkipIntroduction}
              variant="outline"
              className="border-purple-400 text-purple-200 hover:bg-purple-800"
            >
              Skip Introduction
            </Button>
            
            {!isIntroductionComplete && (
              <Button
                onClick={handleManualRead}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSpeaking ? 'Stop Reading' : 'Read Current Step'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NelieIntroduction;
