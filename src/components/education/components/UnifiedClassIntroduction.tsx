
import { Card, CardContent } from '@/components/ui/card';
import { getSubjectIntroduction } from './utils/subjectIntroductions';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import IntroductionHeader from './introduction/IntroductionHeader';
import IntroductionProgressIndicator from './introduction/IntroductionProgressIndicator';
import IntroductionContent from './introduction/IntroductionContent';
import IntroductionControls from './introduction/IntroductionControls';
import IntroductionStatusIndicator from './introduction/IntroductionStatusIndicator';

interface UnifiedClassIntroductionProps {
  subject: string;
  skillArea?: string;
  userLevel?: string;
  onIntroductionComplete: () => void;
}

const UnifiedClassIntroduction = ({
  subject,
  skillArea,
  userLevel = 'beginner',
  onIntroductionComplete
}: UnifiedClassIntroductionProps) => {
  const introduction = getSubjectIntroduction(subject, skillArea, userLevel, 'Student');
  
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8">
            <IntroductionHeader 
              title={introduction.title}
              userName={userName}
              subject={subject}
              isSpeaking={isSpeaking}
            />

            <IntroductionProgressIndicator 
              sections={introduction.sections}
              currentSection={currentSection}
            />

            <IntroductionContent currentContent={currentContent} />

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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
              />
            </div>

            <IntroductionStatusIndicator
              hasStarted={hasStarted}
              isSpeaking={isSpeaking}
              isComplete={isComplete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedClassIntroduction;
