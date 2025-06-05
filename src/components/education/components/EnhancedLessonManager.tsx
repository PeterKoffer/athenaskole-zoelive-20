
import { Card, CardContent } from '@/components/ui/card';
import { useLessonManager } from './hooks/useLessonManager';
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
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    handleActivityComplete,
    handleReadRequest
  } = useLessonManager({
    subject,
    skillArea,
    onLessonComplete
  });

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Nelie is preparing your amazing lesson...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Speech Test Card - only show for admin users */}
      {isAdmin() && <SpeechTestCard />}

      {/* Progress Header */}
      <LessonProgressHeader
        timeElapsed={timeElapsed}
        score={score}
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
      />

      {/* Nelie Avatar Section */}
      <NelieAvatarSection 
        subject={subject} 
        currentQuestionIndex={currentActivityIndex} 
        totalQuestions={lessonActivities.length} 
        isSpeaking={isSpeaking} 
        autoReadEnabled={autoReadEnabled} 
        onMuteToggle={toggleMute} 
        onReadQuestion={handleReadRequest} 
      />

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
        speakText={speakText}
        stopSpeaking={stopSpeaking}
      />

      {/* Activity Content */}
      <EnhancedActivityRenderer
        activity={currentActivity}
        onActivityComplete={handleActivityComplete}
        isNelieReady={isReady && hasUserInteracted}
      />
    </div>
  );
};

export default EnhancedLessonManager;
