
import { useUnifiedLesson } from '../contexts/UnifiedLessonContext';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import LessonActivityManager from './LessonActivityManager';
import LessonCompletedView from './LessonCompletedView';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';
import { DEFAULT_LESSON_SECONDS } from '@/constants/lesson';
import LessonLoadingState from './lessonManager/LessonLoadingState';
import LessonPreparationState from './lessonManager/LessonPreparationState';
import LessonProgressDisplay from './lessonManager/LessonProgressDisplay';
import LessonControls from './lessonManager/LessonControls';

interface EnhancedLessonManagerProps {
  subject: string;
  skillArea: string;
  onBackToProgram: () => void;
}

const EnhancedLessonManager = ({ 
  subject, 
  onBackToProgram 
}: EnhancedLessonManagerProps) => {
  const {
    currentActivityIndex,
    allActivities,
    currentActivity,
    sessionTimer,
    score,
    correctStreak,
    phase,
    handleActivityComplete,
    isLoadingActivities,
    regenerateLesson,
    targetDuration
  } = useUnifiedLesson();

  const {
    isEnabled: autoReadEnabled,
    isSpeaking,
    hasUserInteracted,
    isReady,
    speakAsNelie,
    stop: stopSpeaking,
    toggleEnabled: handleMuteToggle
  } = useUnifiedSpeech();

  console.log(`🎯 Enhanced ${subject} Lesson:`, {
    currentActivityIndex,
    totalActivities: allActivities.length,
    timeElapsed: sessionTimer,
    score,
    phase,
    currentActivity: currentActivity?.title,
    speechEnabled: autoReadEnabled,
    hasUserInteracted,
    isLoadingActivities
  });

  // Show loading state while generating daily lesson
  if (isLoadingActivities) {
    return <LessonLoadingState subject={subject} />;
  }

  if (phase === 'completed' || currentActivityIndex >= allActivities.length) {
    return <LessonCompletedView onBackToProgram={onBackToProgram} />;
  }

  if (!currentActivity) {
    return (
      <LessonPreparationState
        subject={subject}
        activitiesCount={allActivities.length}
        onRegenerate={regenerateLesson}
      />
    );
  }

  // Target lesson length (seconds); prefer context's targetDuration (minutes)
  const targetLessonLength = (typeof targetDuration === 'number' && targetDuration > 0)
    ? targetDuration * 60
    : DEFAULT_LESSON_SECONDS;

  const handleManualRead = async () => {
    if (currentActivity) {
      let speechText = '';
      if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
      } else {
        speechText = `Let me explain: ${currentActivity.title}`;
      }
      if (speechText) {
        if (!isReady) {
          console.log('🔊 [ManualRead] Waiting for speech system readiness...');
          setTimeout(handleManualRead, 600);
          return;
        }
        console.log('🔊 Manual read request:', speechText.substring(0, 50) + '...');
        speakAsNelie(speechText, true);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <LessonActivitySpeechManager
        currentActivity={currentActivity}
        currentActivityIndex={currentActivityIndex}
        autoReadEnabled={autoReadEnabled && hasUserInteracted}
        isReady={hasUserInteracted}
        speakText={speakAsNelie}
        stopSpeaking={stopSpeaking}
      />

      <LessonProgressDisplay
        currentActivityIndex={currentActivityIndex}
        totalActivities={allActivities.length}
        sessionTimer={sessionTimer}
        targetLessonLength={targetLessonLength}
        score={score}
        correctStreak={correctStreak}
        onBackToProgram={onBackToProgram}
      />

      <LessonActivityManager
        activities={allActivities}
        currentActivityIndex={currentActivityIndex}
        score={score}
        onActivityComplete={handleActivityComplete}
        onScoreUpdate={() => {}}
      />

      <LessonControls
        autoReadEnabled={autoReadEnabled}
        isSpeaking={isSpeaking}
        isReady={hasUserInteracted}
        onMuteToggle={handleMuteToggle}
        onManualRead={handleManualRead}
        onRegenerate={regenerateLesson}
      />
    </div>
  );
};

export default EnhancedLessonManager;
