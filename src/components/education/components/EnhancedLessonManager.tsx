
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUnifiedLesson } from '../contexts/UnifiedLessonContext';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import LessonActivityManager from './LessonActivityManager';
import LessonProgressHeader from './LessonProgressHeader';
import LessonControlsFooter from './LessonControlsFooter';
import LessonCompletedView from './LessonCompletedView';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';
import { RefreshCw, Clock } from 'lucide-react';

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
    handleLessonStart,
    isLoadingActivities,
    regenerateLesson
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
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Generating Your Daily {subject.charAt(0).toUpperCase() + subject.slice(1)} Lesson
              </h3>
              <p className="text-gray-400 text-lg">
                Creating a personalized lesson based on your progress and grade level...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-lime-400 mt-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing your learning progress</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (phase === 'completed' || currentActivityIndex >= allActivities.length) {
    return <LessonCompletedView onBackToProgram={onBackToProgram} />;
  }

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center space-y-4">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Preparing your {subject} lesson...
            </h3>
            <p className="text-gray-400">
              Setting up {allActivities.length} personalized learning activities
            </p>
          </div>
          <Button 
            onClick={regenerateLesson}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Lesson
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Target lesson length is 20 minutes (1200 seconds)
  const targetLessonLength = 1200;

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
        onResetProgress={regenerateLesson}
      />

      {/* Quick regenerate button for testing */}
      <div className="text-center">
        <Button 
          onClick={regenerateLesson}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Lesson
        </Button>
      </div>
    </div>
  );
};

export default EnhancedLessonManager;
