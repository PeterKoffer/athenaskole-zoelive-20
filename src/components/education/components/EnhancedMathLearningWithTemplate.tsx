
import { useExtendedLessonManager } from './hooks/useExtendedLessonManager';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Trophy, Target } from 'lucide-react';
import LessonActivityManager from './LessonActivityManager';
import LessonCompletedView from './LessonCompletedView';
import NelieAvatarSection from './NelieAvatarSection';

interface EnhancedMathLearningWithTemplateProps {
  onBackToProgram: () => void;
}

const EnhancedMathLearningWithTemplate = ({ onBackToProgram }: EnhancedMathLearningWithTemplateProps) => {
  const {
    currentActivityIndex,
    lessonActivities,
    timeElapsed,
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
    toggleMute,
    handleActivityComplete,
    handleReadRequest,
    refreshWithNewQuestions,
    sessionId
  } = useExtendedLessonManager({
    subject: 'mathematics',
    skillArea: 'Addition and Number Patterns',
    onLessonComplete: onBackToProgram
  });

  // Show loading state while generating the full lesson
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Preparing Your Mathematics Lesson</h2>
              <p className="text-gray-300 mb-4">
                Creating a personalized lesson with diverse activities...
              </p>
              <div className="text-sm text-gray-400">
                Session ID: {sessionId}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show completion view when lesson is done
  if (currentActivityIndex >= lessonActivities.length) {
    return <LessonCompletedView onBackToProgram={onBackToProgram} />;
  }

  const progressPercentage = Math.min((currentActivityIndex / lessonActivities.length) * 100, 100);
  const timeProgressPercentage = Math.min((timeElapsed / (targetLessonLength * 60)) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with progress */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBackToProgram}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Program
              </button>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Session: {sessionId.slice(-6)}</span>
                <button
                  onClick={refreshWithNewQuestions}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
                >
                  New Questions
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-white">
                <Target className="w-5 h-5 mr-2 text-lime-400" />
                <div>
                  <span className="text-sm text-gray-400">Progress</span>
                  <div className="font-bold">{currentActivityIndex + 1}/{lessonActivities.length}</div>
                </div>
              </div>
              
              <div className="flex items-center text-white">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                <div>
                  <span className="text-sm text-gray-400">Time</span>
                  <div className="font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>

              <div className="flex items-center text-white">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                <div>
                  <span className="text-sm text-gray-400">Score</span>
                  <div className="font-bold">{score}</div>
                </div>
              </div>

              <div className="flex items-center text-white">
                <div className="w-5 h-5 mr-2 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                  🔥
                </div>
                <div>
                  <span className="text-sm text-gray-400">Streak</span>
                  <div className="font-bold">{correctStreak}</div>
                </div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Lesson Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-lime-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>Time Target ({targetLessonLength} min)</span>
                <span>{Math.round(timeProgressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${timeProgressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nelie Avatar */}
        <NelieAvatarSection
          isSpeaking={isSpeaking}
          autoReadEnabled={autoReadEnabled}
          hasUserInteracted={hasUserInteracted}
          isReady={isReady}
          onToggleMute={toggleMute}
          onReadRequest={handleReadRequest}
          engagementLevel={engagementLevel}
          adaptiveSpeed={adaptiveSpeed}
        />

        {/* Main lesson content */}
        <LessonActivityManager
          activities={lessonActivities}
          currentActivityIndex={currentActivityIndex}
          score={score}
          onActivityComplete={handleActivityComplete}
          onScoreUpdate={() => {}}
        />

        {/* Footer stats */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="text-gray-400">Activities</div>
                <div className="text-white font-bold">{lessonActivities.length}</div>
              </div>
              <div>
                <div className="text-gray-400">Questions Generated</div>
                <div className="text-white font-bold">{questionsGenerated}</div>
              </div>
              <div>
                <div className="text-gray-400">Target Duration</div>
                <div className="text-white font-bold">{targetLessonLength} min</div>
              </div>
              <div>
                <div className="text-gray-400">Engagement</div>
                <div className="text-white font-bold">{engagementLevel}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedMathLearningWithTemplate;
