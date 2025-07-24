
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import { getSubjectIntroduction } from './utils/subjectIntroductions';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import IntroductionHeader from './IntroductionHeader';
import IntroductionContent from './introduction/IntroductionContent';

interface UnifiedClassIntroductionProps {
  subject: string;
  skillArea: string;
  userLevel: string;
  onIntroductionComplete: () => void;
  isAdvancing?: boolean;
}

const UnifiedClassIntroduction = ({
  subject,
  skillArea,
  userLevel,
  onIntroductionComplete
}: UnifiedClassIntroductionProps) => {
  const [userName] = useState('Student');
  
  // Get subject-specific introduction content
  const introduction = getSubjectIntroduction(subject, skillArea, userLevel, userName);
  
  const {
    hasStarted,
    currentSection,
    canProceedWithoutSpeech,
    currentContent,
    isComplete,
    isSpeaking,
    isEnabled,
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

  const classroomConfig = getClassroomConfig(subject);

  console.log('🎭 UnifiedClassIntroduction:', {
    subject,
    skillArea,
    hasStarted,
    currentSection,
    isComplete,
    isSpeaking,
    canProceedWithoutSpeech
  });

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <IntroductionHeader subject={subject} isSpeaking={isSpeaking} />
            
            <IntroductionContent
              currentStepText={currentContent.text}
              currentStep={currentSection}
              totalSteps={introduction.sections.length}
              autoReadEnabled={isEnabled}
              isSpeaking={isSpeaking}
              isIntroductionComplete={isComplete}
              subject={subject}
              onMuteToggle={toggleEnabled}
              onManualRead={handleManualRead}
              onStartLesson={handleStartLesson}
            />

            {/* Start buttons */}
            {!hasStarted && (
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={handleManualStart}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Introduction with Nelie
                </Button>
                
                {canProceedWithoutSpeech && (
                  <Button
                    onClick={handleProceedWithoutSpeech}
                    variant="outline"
                    className="border-purple-400 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
                  >
                    Start Lesson Without Speech
                  </Button>
                )}
              </div>
            )}

            {/* Skip button when introduction is running */}
            {hasStarted && !isComplete && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="sm"
                  className="border-gray-400 text-gray-300 hover:bg-gray-700"
                >
                  Skip Introduction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedClassIntroduction;
