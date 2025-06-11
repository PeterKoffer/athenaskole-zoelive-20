
import { Card, CardContent } from '@/components/ui/card';
import { useExtendedLessonManager } from './hooks/useExtendedLessonManager';
import LessonActivityManager from './LessonActivityManager';
import LessonProgressHeader from './LessonProgressHeader';
import LessonControlsFooter from './LessonControlsFooter';
import LessonCompletedView from './LessonCompletedView';
import NelieIntroduction from './NelieIntroduction';

interface EnhancedLessonManagerProps {
  subject: string;
  skillArea: string;
  onBackToProgram: () => void;
}

const EnhancedLessonManager = ({ 
  subject, 
  skillArea, 
  onBackToProgram 
}: EnhancedLessonManagerProps) => {
  const {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    totalEstimatedTime,
    score,
    correctStreak,
    questionsGenerated,
    targetLessonLength,
    isInitializing,
    engagementLevel,
    adaptiveSpeed,
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    handleActivityComplete,
    handleReadRequest,
    resetProgress
  } = useExtendedLessonManager({
    subject,
    skillArea,
    onLessonComplete: onBackToProgram
  });

  console.log(`🎯 Enhanced ${subject} Lesson:`, {
    currentActivityIndex,
    totalActivities: lessonActivities.length,
    timeElapsed,
    score,
    isInitializing
  });

  // Show introduction if no user interaction yet
  if (!hasUserInteracted) {
    return (
      <NelieIntroduction
        subject={subject}
        onStartLesson={handleReadRequest}
        isSpeaking={isSpeaking}
        autoReadEnabled={autoReadEnabled}
        onMuteToggle={toggleMute}
        isReady={isReady}
      />
    );
  }

  // Show completed view when lesson is done
  if (currentActivityIndex >= lessonActivities.length || timeElapsed >= targetLessonLength) {
    return <LessonCompletedView onBackToProgram={onBackToProgram} />;
  }

  // Show loading state during initialization
  if (isInitializing || !currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Preparing your {subject} lesson...
            </h3>
            <p className="text-gray-400">
              Generating {questionsGenerated} subject-specific questions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <LessonProgressHeader
        subject={subject}
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
        timeElapsed={timeElapsed}
        targetLessonLength={targetLessonLength}
        score={score}
        correctStreak={correctStreak}
        engagementLevel={engagementLevel}
        questionsGenerated={questionsGenerated}
        onBackToProgram={onBackToProgram}
      />

      <LessonActivityManager
        activities={lessonActivities}
        currentActivityIndex={currentActivityIndex}
        score={score}
        onActivityComplete={handleActivityComplete}
        onScoreUpdate={() => {}} // Score updates handled in handleActivityComplete
      />

      <LessonControlsFooter
        autoReadEnabled={autoReadEnabled}
        isSpeaking={isSpeaking}
        isReady={isReady}
        adaptiveSpeed={adaptiveSpeed}
        onMuteToggle={toggleMute}
        onManualRead={handleReadRequest}
        onResetProgress={resetProgress}
      />
    </div>
  );
};

export default EnhancedLessonManager;
