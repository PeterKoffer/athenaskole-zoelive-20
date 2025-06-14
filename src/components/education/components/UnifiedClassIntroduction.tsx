
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import IntroductionHeader from './introduction/IntroductionHeader';
import IntroductionContent from './introduction/IntroductionContent';
import IntroductionControls from './introduction/IntroductionControls';
import IntroductionProgressIndicator from './introduction/IntroductionProgressIndicator';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';

interface UnifiedClassIntroductionProps {
  subject: string;
  skillArea: string;
  userLevel: string;
  onIntroductionComplete: () => void;
}

const UnifiedClassIntroduction = ({
  subject,
  skillArea,
  userLevel,
  onIntroductionComplete
}: UnifiedClassIntroductionProps) => {
  const classroomConfig = getClassroomConfig(subject);

  const {
    currentStep,
    totalSteps,
    isAutoPlaying,
    isSpeechEnabled,
    introductionData,
    handleNext,
    handlePrevious,
    handleComplete,
    handleToggleAutoPlay,
    handleToggleSpeech,
    handleManualRead,
    canGoNext,
    canGoPrevious
  } = useIntroductionLogic({
    subject,
    skillArea,
    userLevel,
    onIntroductionComplete
  });

  const currentStepData = introductionData?.steps?.[currentStep];

  if (!introductionData || !currentStepData) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gray-800/80 border-gray-700 rounded-lg p-8 text-center backdrop-blur-sm">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-blue-400 rounded-full mx-auto mb-4"></div>
              <h3 className="text-white text-lg font-semibold mb-2">Preparing Your Introduction</h3>
              <p className="text-gray-400">Setting up your learning experience...</p>
            </div>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <IntroductionHeader 
          subject={subject}
          title={introductionData.title}
          description={introductionData.description}
        />

        <IntroductionProgressIndicator 
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <div className="bg-gray-800/80 border-gray-700 rounded-lg p-6 backdrop-blur-sm">
          <IntroductionContent 
            stepData={currentStepData}
            subject={subject}
          />

          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSpeech}
                className="border-purple-400 text-purple-200 bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/60"
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {isSpeechEnabled ? 'Mute' : 'Unmute'} Nelie
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRead}
                className="border-blue-400 text-blue-200 bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/60"
              >
                <Play className="w-4 h-4 mr-1" />
                Repeat
              </Button>
            </div>

            <IntroductionControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              isAutoPlaying={isAutoPlaying}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onComplete={handleComplete}
              onToggleAutoPlay={handleToggleAutoPlay}
            />
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedClassIntroduction;
