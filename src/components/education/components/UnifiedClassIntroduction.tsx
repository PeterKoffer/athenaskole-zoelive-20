
import { Button } from '@/components/ui/button';
import { Play, Home } from 'lucide-react';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import { getSubjectIntroduction } from './utils/subjectIntroductions';
import { useNavigate } from 'react-router-dom';

// Extracted subcomponents
import IntroductionHeader from './introduction/IntroductionHeader';
import IntroductionProgressIndicator from './introduction/IntroductionProgressIndicator';
import IntroductionContent from './introduction/IntroductionContent';
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
  onIntroductionComplete,
}: UnifiedClassIntroductionProps) => {
  const classroomConfig = getClassroomConfig(subject);
  const introduction = getSubjectIntroduction(subject, skillArea, userLevel);

  const navigate = useNavigate();

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
    toggleEnabled,
  } = useIntroductionLogic({
    introduction,
    subject,
    onIntroductionComplete,
  });

  if (!introduction || !currentContent) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gray-800/80 border-gray-700 rounded-lg p-8 text-center backdrop-blur-sm">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-blue-400 rounded-full mx-auto mb-4"></div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Preparing Your Introduction
              </h3>
              <p className="text-gray-400">Setting up your learning experience...</p>
            </div>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  // Handler for Home/Back navigation
  const handleHome = () => {
    navigate('/daily-program');
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <IntroductionHeader
          title={introduction.title}
          userName={userName}
          subject={subject}
          isSpeaking={isSpeaking}
        />

        {/* Progress Indicator */}
        <IntroductionProgressIndicator
          sections={introduction.sections}
          currentSection={currentSection}
        />

        <div className="bg-gray-800/80 border-gray-700 rounded-lg p-6 backdrop-blur-sm">
          {/* Introduction Content */}
          <IntroductionContent currentContent={currentContent} />

          {/* Controls */}
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex flex-1 flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleManualRead}
                className="border-purple-400 text-purple-200 bg-gray-800/50"
                disabled={!isEnabled && hasUserInteracted}
              >
                <Play className="w-4 h-4 mr-2" />
                Repeat
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-gray-200 bg-gray-800/50"
                onClick={handleHome}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              {!hasStarted && (
                <Button
                  onClick={handleManualStart}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Introduction with Nelie
                </Button>
              )}
              {!hasStarted && canProceedWithoutSpeech && (
                <Button
                  onClick={handleProceedWithoutSpeech}
                  variant="outline"
                  className="border-gray-400 text-gray-200 bg-gray-800/50 px-6 py-3"
                >
                  Start Lesson Without Speech
                </Button>
              )}
            </div>
            {hasStarted && (
              <div className="flex flex-wrap gap-2">
                {isComplete ? (
                  <Button
                    onClick={onIntroductionComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    Start Class
                  </Button>
                ) : (
                  <>
                    {(isSpeaking || hasStarted) && (
                      <Button
                        onClick={handleStartLesson}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        Start Lesson
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      className="border-gray-400 text-gray-200 bg-gray-800/50"
                    >
                      Skip Introduction
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedClassIntroduction;

