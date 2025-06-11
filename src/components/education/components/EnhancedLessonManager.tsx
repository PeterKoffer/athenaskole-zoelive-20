
import { Card, CardContent } from '@/components/ui/card';
import { useExtendedLessonManager } from './hooks/useExtendedLessonManager';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import LessonProgressSection from './LessonProgressSection';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';
import SpeechTestCard from './SpeechTestCard';

interface EnhancedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  onBack: () => void;
}

const EnhancedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  onBack
}: EnhancedLessonManagerProps) => {
  const { isAdmin } = useRoleAccess();
  
  const {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    score,
    questionsGenerated,
    targetLessonLength,
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    handleActivityComplete,
    handleReadRequest
  } = useExtendedLessonManager({
    subject,
    skillArea,
    onLessonComplete
  });

  // Wrapper function to match expected interface
  const speakTextWrapper = (text: string, priority?: boolean) => {
    speakText(text, 'explanation');
  };

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Nelie is preparing your {targetLessonLength}-minute lesson...</p>
          {questionsGenerated > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Generated {questionsGenerated} questions so far
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {/* Speech Test Card - only show for admin users */}
      {isAdmin() && <SpeechTestCard />}

      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <LessonProgressHeader
          timeElapsed={timeElapsed}
          score={score}
          currentActivityIndex={currentActivityIndex}
          totalActivities={lessonActivities.length}
        />
      </div>

      {/* Lesson info card */}
      <Card className="bg-blue-900/20 border-blue-700">
        <CardContent className="p-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            <span className="text-blue-300">
              {targetLessonLength}-minute lesson
            </span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="text-blue-400">
              {questionsGenerated} questions generated
            </span>
          </div>
          <p className="text-blue-400 text-xs mt-1">
            Adaptive content that grows with your learning
          </p>
        </CardContent>
      </Card>

      {/* Nelie Avatar Section */}
      <div className="flex justify-center">
        <NelieAvatarSection 
          subject={subject} 
          currentQuestionIndex={currentActivityIndex} 
          totalQuestions={lessonActivities.length} 
          isSpeaking={isSpeaking} 
          autoReadEnabled={autoReadEnabled} 
          onMuteToggle={toggleMute} 
          onReadQuestion={handleReadRequest} 
        />
      </div>

      {/* Progress Bar */}
      <LessonProgressSection
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
        currentActivityTitle={currentActivity.title}
      />

      {/* Speech Manager - handles auto-speaking when activities change */}
      <LessonActivitySpeechManager
        currentActivity={currentActivity}
        currentActivityIndex={currentActivityIndex}
        autoReadEnabled={autoReadEnabled && hasUserInteracted}
        isReady={isReady && hasUserInteracted}
        speakText={speakTextWrapper}
        stopSpeaking={stopSpeaking}
      />

      {/* Activity Content */}
      <div className="w-full">
        <EnhancedActivityRenderer
          activity={currentActivity}
          onActivityComplete={handleActivityComplete}
          isNelieReady={isReady && hasUserInteracted}
        />
      </div>
    </div>
  );
};

export default EnhancedLessonManager;
