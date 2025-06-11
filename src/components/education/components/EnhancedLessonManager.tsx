
import { Card, CardContent } from '@/components/ui/card';
import { useUnifiedLesson } from '../contexts/UnifiedLessonContext';
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

  console.log(`🎯 Enhanced ${subject} Lesson:`, {
    currentActivityIndex,
    totalActivities: allActivities.length,
    timeElapsed: sessionTimer,
    score,
    phase,
    currentActivity: currentActivity?.title
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

  return (
    <div className="max-w-4xl mx-auto">
      <LessonProgressHeader
        currentActivityIndex={currentActivityIndex}
        totalActivities={allActivities.length}
        timeElapsed={sessionTimer}
        targetLessonLength={targetLessonLength}
        score={score}
        correctStreak={correctStreak}
        engagementLevel={85} // Default engagement level
        questionsGenerated={allActivities.length}
        onBackToProgram={onBackToProgram}
      />

      <LessonActivityManager
        activities={allActivities}
        currentActivityIndex={currentActivityIndex}
        score={score}
        onActivityComplete={handleActivityComplete}
        onScoreUpdate={() => {}} // Score updates handled in context
      />

      <LessonControlsFooter
        autoReadEnabled={true}
        isSpeaking={false}
        isReady={true}
        adaptiveSpeed={1.0}
        onMuteToggle={() => {}}
        onManualRead={() => {
          if (currentActivity) {
            console.log('🔊 Manual read request for:', currentActivity.title);
            // Add speech logic here if needed
          }
        }}
        onResetProgress={() => window.location.reload()}
      />
    </div>
  );
};

export default EnhancedLessonManager;
