import ClassroomEnvironment from './shared/ClassroomEnvironment';
import { getClassroomConfig } from './shared/classroomConfigs';
import { getSubjectIntroduction } from './utils/subjectIntroductions';
import { useNavigate } from 'react-router-dom';
import { useIntroductionLogic } from './introduction/hooks/useIntroductionLogic';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

import UnifiedClassIntroductionHeader from './UnifiedClassIntroductionHeader';
import UnifiedClassIntroductionProgress from './UnifiedClassIntroductionProgress';
import IntroductionContent from './introduction/IntroductionContent';
import UnifiedClassIntroductionControls from './UnifiedClassIntroductionControls';

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
  onIntroductionComplete,
  isAdvancing,
}: UnifiedClassIntroductionProps) => {
  const classroomConfig = getClassroomConfig(subject);
  const introduction = getSubjectIntroduction(subject, skillArea, userLevel);
  const navigate = useNavigate();

  const { stop } = useUnifiedSpeech();

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
    stop();
    navigate('/daily-program');
  };

  // Handler for "Start Lesson Without Speech" - must stop speech, then proceed.
  const handleProceedWithoutSpeechWrapper = () => {
    stop();
    handleProceedWithoutSpeech();
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <UnifiedClassIntroductionHeader
          title={introduction.title}
          userName={userName}
          subject={subject}
          isSpeaking={isSpeaking}
        />

        <UnifiedClassIntroductionProgress
          sections={introduction.sections}
          currentSection={currentSection}
        />

        {/* Standardized blackboard-style introduction sign */}
        <div
          className="board-intro bg-black/90 border-[3px] border-[#8B4513] shadow-2xl rounded-lg p-6 backdrop-blur-md mx-auto"
          style={{
            maxWidth: 760,
            boxShadow: "0 6px 36px 6px rgba(20,22,24,0.45)",
            borderRadius: 16,
            borderColor: "#8B4513",
            borderWidth: 3,
            backgroundColor: "rgba(30, 32, 36, 0.92)",
          }}
        >
          <IntroductionContent
            currentStepText={currentContent.text}
            currentStep={currentSection}
            totalSteps={introduction.sections.length}
            autoReadEnabled={isEnabled}
            isSpeaking={isSpeaking}
            isIntroductionComplete={isComplete}
            onMuteToggle={toggleEnabled}
            onManualRead={handleManualRead}
            onStartLesson={handleStartLesson}
          />
          <UnifiedClassIntroductionControls
            hasStarted={hasStarted}
            canProceedWithoutSpeech={canProceedWithoutSpeech}
            isEnabled={isEnabled}
            isSpeaking={isSpeaking}
            isComplete={isComplete}
            hasUserInteracted={hasUserInteracted}
            handleManualStart={handleManualStart}
            handleManualRead={handleManualRead}
            toggleEnabled={toggleEnabled}
            onIntroductionComplete={onIntroductionComplete}
            handleStartLesson={handleStartLesson}
            handleSkip={handleSkip}
            // Home and ProceedWithoutSpeech involve forcing speech to stop first!
            handleHome={handleHome}
            handleProceedWithoutSpeech={handleProceedWithoutSpeechWrapper}
            isAdvancing={isAdvancing}
          />
        </div>
        {/* 
          If you need pixel-perfect "lock" to board:
          - Change mx-auto to absolute positioning with top/left if your background never changes
          - Or manually tweak marginTop (via style) to align
          - But centering with mx-auto + p-6 looks good at all screen sizes
        */}
      </div>
    </ClassroomEnvironment>
  );
};

export default UnifiedClassIntroduction;
