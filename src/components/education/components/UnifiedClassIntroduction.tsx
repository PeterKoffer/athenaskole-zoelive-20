import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { getSubjectIntroduction } from './utils/subjectIntroductions';
import IntroductionControls from './introduction/IntroductionControls';

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
  const introduction = getSubjectIntroduction(subject, skillArea, userLevel);

  const {
    hasStarted,
    currentSection,
    userName,
    canProceedWithoutSpeech,
    currentContent,
    isComplete,
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    handleManualStart,
    handleManualRead,
    handleSkip,
    handleStartLesson,
    handleProceedWithoutSpeech,
    toggleEnabled
  } = useIntroductionLogic({
    introduction,
    subject,
    onIntroductionComplete
  });

  if (!introduction || !currentContent) {
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

  // NEW handler for Home/Back navigation, goes to daily program
  const handleHome = () => {
    window.location.href = "/daily-program";
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Introduction Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <RobotAvatar 
              size="xl" 
              isActive={true} 
              isSpeaking={isSpeaking}
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {introduction.title}
          </h2>
          <p className="text-purple-200">
            Welcome to your {subject} class with Nelie, {userName}!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {introduction.sections.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentSection 
                    ? 'bg-purple-400' 
                    : 'bg-purple-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-800/80 border-gray-700 rounded-lg p-6 backdrop-blur-sm">
          {/* Introduction Content */}
          <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              {currentContent.title}
            </h3>
            <p className="text-purple-100 leading-relaxed text-lg">
              {currentContent.text}
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleEnabled}
                className="border-purple-400 text-purple-200 bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/60"
              >
                {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {isEnabled ? 'Mute' : 'Unmute'} Nelie
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
            {/* Introduction Controls */}
            <div className="flex space-x-2">
              {/* Pass new onHome handler to controls */}
              <IntroductionControls
                hasStarted={hasStarted}
                canProceedWithoutSpeech={canProceedWithoutSpeech}
                isEnabled={isEnabled}
                isSpeaking={isSpeaking}
                isComplete={isComplete}
                hasUserInteracted={hasUserInteracted}
                onManualStart={handleManualStart}
                onProceedWithoutSpeech={handleProceedWithoutSpeech}
                onToggleEnabled={toggleEnabled}
                onManualRead={handleManualRead}
                onIntroductionComplete={onIntroductionComplete}
                onStartLesson={handleStartLesson}
                onSkip={handleSkip}
                onHome={handleHome}
              />
            </div>
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedClassIntroduction;
