import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import MathLessonHeader from './MathLessonHeader';
import MathLessonControlPanel from './MathLessonControlPanel';
import MentalMathStrategies from './MentalMathStrategies';
import MathLessonContentRenderer from './MathLessonContentRenderer';
import { LessonActivity } from '../types/LessonTypes';

interface MathLearningMainContentProps {
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  currentActivity: LessonActivity | null;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (wasCorrect?: boolean) => void;
  onNavigateToActivity?: (index: number) => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
  isCurrentActivityCompleted?: boolean;
}

const MathLearningMainContent = ({
  studentName,
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  currentActivity,
  isSpeaking,
  onBackToProgram,
  onToggleMute: _onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete,
  onNavigateToActivity,
  canNavigateBack = false,
  canNavigateForward = false,
  isCurrentActivityCompleted = false
}: MathLearningMainContentProps) => {
  

  const handleNavigateBack = () => {
    if (canNavigateBack && onNavigateToActivity) {
      console.log('🔙 Navigating to previous activity:', currentActivityIndex - 1);
      onNavigateToActivity(currentActivityIndex - 1);
    }
  };

  const handleNavigateForward = () => {
    if (canNavigateForward && onNavigateToActivity) {
      console.log('🔜 Navigating to next activity:', currentActivityIndex + 1);
      onNavigateToActivity(currentActivityIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full space-y-0">
        <MathLessonHeader
          studentName={studentName}
          timeElapsed={timeElapsed}
          targetLessonLength={targetLessonLength}
          score={score}
          currentActivityIndex={currentActivityIndex}
          totalRealActivities={totalRealActivities}
          correctStreak={correctStreak}
          onBackToProgram={onBackToProgram}
          onNavigateBack={handleNavigateBack}
          onNavigateForward={handleNavigateForward}
          canNavigateBack={canNavigateBack}
          canNavigateForward={canNavigateForward}
          currentActivityType={currentActivity?.type}
          currentActivityPhase={currentActivity?.phase}
        />

        <MathLessonControlPanel
          onGoHome={onBackToProgram}
          isSpeaking={isSpeaking}
          onReadRequest={onReadRequest}
          onStopSpeaking={onStopSpeaking}
        />

        {/* Current Activity Content - Full width content area with classroom-aware styling */}
        <div className="w-full px-4 py-6">
          <div className="w-full max-w-4xl mx-auto">
            {currentActivity ? (
              <div className="space-y-6">
                {currentActivity.type === 'interactive-game' ? (
                  <OptimizedQuestionActivity
                    subject="mathematics"
                    skillArea="general_math"
                    difficultyLevel={2}
                    onComplete={onActivityComplete}
                    questionNumber={currentActivityIndex + 1}
                    totalQuestions={totalRealActivities}
                  />
                ) : (
                  <>
                    {currentActivity.title?.toLowerCase().includes('mental math strategies') ? (
                      <MentalMathStrategies
                        studentName={studentName}
                        onComplete={() => onActivityComplete()}
                      />
                    ) : (
                      <MathLessonContentRenderer
                        activity={currentActivity}
                        studentName={studentName}
                        onComplete={() => onActivityComplete()}
                      />
                    )}
                  </>
                )}
                
                {/* Activity completion status indicator */}
                {isCurrentActivityCompleted && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      ✓ Activity Completed
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
                <p className="text-red-300">Please try refreshing the lesson, {studentName}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathLearningMainContent;
