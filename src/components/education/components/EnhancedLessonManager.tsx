
import { Card, CardContent } from '@/components/ui/card';
import { useUnifiedLesson } from '../contexts/UnifiedLessonContext';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import LessonActivityManager from './LessonActivityManager';
import LessonProgressHeader from './LessonProgressHeader';
import LessonControlsFooter from './LessonControlsFooter';
import LessonCompletedView from './LessonCompletedView';
import NelieIntroduction from './NelieIntroduction';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';

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
    allActivities,
    currentActivity,
    sessionTimer,
    score,
    correctStreak,
    phase,
    isTimerActive,
    handleActivityComplete,
    handleLessonStart
  } = useUnifiedLesson();

  // Add speech functionality back
  const {
    isEnabled: autoReadEnabled,
    isSpeaking,
    hasUserInteracted,
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
    hasUserInteracted
  });

  // Show introduction if lesson hasn't started yet
  if (phase === 'introduction') {
    return (
      <NelieIntroduction
        subject={subject}
        skillArea={skillArea}
        onIntroductionComplete={handleLessonStart}
      />
    );
  }

  // Show completed view when lesson is done
  if (phase === 'completed' || currentActivityIndex >= allActivities.length) {
    return <LessonCompletedView onBackToProgram={onBackToProgram} />;
  }

  // Show loading state if no current activity
  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Loading your {subject} lesson...
            </h3>
            <p className="text-gray-400">
              Preparing {allActivities.length} learning activities
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const targetLessonLength = Math.max(15 * 60, allActivities.reduce((total, activity) => total + activity.duration, 0));

  const handleManualRead = () => {
    if (currentActivity) {
      let speechText = '';
      
      if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || `Welcome to your ${subject} lesson!`;
      } else if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
      } else {
        speechText = `Let me explain: ${currentActivity.title}`;
      }
      
      if (speechText) {
        console.log('🔊 Manual read request:', speechText.substring(0, 50) + '...');
        speakAsNelie(speechText, true);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Add speech manager back */}
      <LessonActivitySpeechManager
        currentActivity={currentActivity}
        currentActivityIndex={currentActivityIndex}
        autoReadEnabled={autoReadEnabled && hasUserInteracted}
        isReady={hasUserInteracted}
        speakText={speakAsNelie}
        stopSpeaking={stopSpeaking}
      />

      <LessonProgressHeader
        currentActivityIndex={currentActivityIndex}
        totalActivities={allActivities.length}
        timeElapsed={sessionTimer}
        targetLessonLength={targetLessonLength}
        score={score}
        correctStreak={correctStreak}
        engagementLevel={85}
        questionsGenerated={allActivities.length}
        onBackToProgram={onBackToProgram}
      />

      <LessonActivityManager
        activities={allActivities}
        currentActivityIndex={currentActivityIndex}
        score={score}
        onActivityComplete={handleActivityComplete}
        onScoreUpdate={() => {}}
      />

      <LessonControlsFooter
        autoReadEnabled={autoReadEnabled}
        isSpeaking={isSpeaking}
        isReady={hasUserInteracted}
        adaptiveSpeed={1.0}
        onMuteToggle={handleMuteToggle}
        onManualRead={handleManualRead}
        onResetProgress={() => window.location.reload()}
      />
    </div>
  );
};

export default EnhancedLessonManager;
