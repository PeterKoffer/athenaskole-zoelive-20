
import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import MathLessonHeader from './MathLessonHeader';
import MathLessonControlPanel from './MathLessonControlPanel';
import MentalMathStrategies from './MentalMathStrategies';
import MathLessonContentRenderer from './MathLessonContentRenderer';
import EnhancedActivityRenderer from '../EnhancedActivityRenderer';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import { LessonActivity } from '../types/LessonTypes';
import { Button } from '@/components/ui/button';
import TextWithSpeaker from '../shared/TextWithSpeaker';

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
  onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete,
  onNavigateToActivity,
  canNavigateBack = false,
  canNavigateForward = false,
  isCurrentActivityCompleted = false
}: MathLearningMainContentProps) => {
  const classroomConfig = getClassroomConfig('mathematics');

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

  const handleActivityCompleteWithAdvancement = (wasCorrect?: boolean) => {
    console.log('🚀 Activity completed, triggering IMMEDIATE advancement:', wasCorrect);
    onActivityComplete(wasCorrect);
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
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
          isSpeaking={isSpeaking}
          onToggleMute={onToggleMute}
          onReadRequest={onReadRequest}
          onStopSpeaking={onStopSpeaking}
        />

        {/* Current Activity Content */}
        <div className="w-full px-4 py-6">
          <div className="w-full max-w-4xl mx-auto">
            {currentActivity ? (
              <div className="space-y-6">
                {/* Use the enhanced activity renderer for better handling */}
                <EnhancedActivityRenderer
                  activity={currentActivity}
                  onActivityComplete={handleActivityCompleteWithAdvancement}
                  isNelieReady={true}
                />
                
                {/* Fixed adventure progress indicator - Show actual adventure number */}
                <div className="text-center space-y-4 mt-8">
                  <div className="inline-flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-6 py-4 border border-blue-400/50 shadow-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold text-lg drop-shadow-lg">
                      Adventure {Math.max(1, currentActivityIndex)} of {Math.max(1, totalRealActivities - 1)}
                    </span>
                  </div>
                  
                  {/* Improved progression message with better contrast */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block border border-gray-400/30">
                    <p className="text-white font-medium drop-shadow-lg">
                      Complete the activity above to continue your mathematical journey!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center backdrop-blur-sm">
                <TextWithSpeaker 
                  text="No Content Available"
                  context="error-title"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
                </TextWithSpeaker>
                <TextWithSpeaker 
                  text={`Please try refreshing the lesson, ${studentName}.`}
                  context="error-message"
                >
                  <p className="text-red-300">Please try refreshing the lesson, {studentName}.</p>
                </TextWithSpeaker>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Refresh Lesson
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default MathLearningMainContent;
