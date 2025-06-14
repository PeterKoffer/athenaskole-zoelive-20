
import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import EnglishLessonHeader from './EnglishLessonHeader';
import EnglishLessonControlPanel from './EnglishLessonControlPanel';
import EnglishWritingStrategies from './EnglishWritingStrategies';
import EnglishLessonContentRenderer from './EnglishLessonContentRenderer';
import { LessonActivity } from '../types/LessonTypes';

interface EnglishLearningMainContentProps {
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

const EnglishLearningMainContent = ({
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
}: EnglishLearningMainContentProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full space-y-0">
        <EnglishLessonHeader
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

        <EnglishLessonControlPanel
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
                    subject="english"
                    skillArea="creative_writing"
                    difficultyLevel={2}
                    onComplete={onActivityComplete}
                    questionNumber={currentActivityIndex + 1}
                    totalQuestions={totalRealActivities}
                  />
                ) : (
                  <>
                    {currentActivity.title?.toLowerCase().includes('writing strategies') ? (
                      <EnglishWritingStrategies
                        studentName={studentName}
                        onComplete={() => onActivityComplete()}
                      />
                    ) : (
                      <EnglishLessonContentRenderer
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

export default EnglishLearningMainContent;
