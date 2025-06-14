
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
  onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete
}: MathLearningMainContentProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
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
          currentActivityType={currentActivity?.type}
          currentActivityPhase={currentActivity?.phase}
        />

        <MathLessonControlPanel
          isSpeaking={isSpeaking}
          onToggleMute={onToggleMute}
          onReadRequest={onReadRequest}
          onStopSpeaking={onStopSpeaking}
        />

        {/* Current Activity Content - Full width content area */}
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
              </div>
            ) : (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center">
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
