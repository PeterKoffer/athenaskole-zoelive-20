
import { useState, useEffect } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import { useStudentName } from '../math/hooks/useStudentName';
import { useSpeechCleanup } from '../math/hooks/useSpeechCleanup';
import MathLearningLoading from './MathLearningLoading';
import MathLearningMainContent from './MathLearningMainContent';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({ onBackToProgram }: OptimizedMathLearningContentProps) => {
  const [manualActivityIndex, setManualActivityIndex] = useState<number | null>(null);
  const studentName = useStudentName();
  const { forceStopAll } = useUnifiedSpeech();

  // Enhanced speech cleanup for all navigation scenarios
  useSpeechCleanup(() => {
    console.log('🔇 [MathLearning] Cleanup triggered - force stopping all speech');
    forceStopAll();
  });

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🔇 [MathLearning] Component unmounting - force stopping speech');
      forceStopAll();
    };
  }, [forceStopAll]);

  const {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    isCurrentActivityCompleted,
    canNavigateForward,
    canNavigateBack,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute,
    setCurrentActivityIndex
  } = useOptimizedLessonManager({
    subject: 'mathematics',
    skillArea: 'general_math',
    onLessonComplete: () => {
      console.log('🔇 [MathLearning] Lesson completing - stopping speech');
      forceStopAll();
      onBackToProgram();
    },
    manualActivityIndex
  });

  const handleBackToProgram = () => {
    console.log('🔇 [MathLearning] Back to program - stopping speech');
    forceStopAll();
    onBackToProgram();
  };

  const handleNavigateToActivity = (index: number) => {
    console.log('🧭 Manual navigation to activity:', index);
    setManualActivityIndex(index);
    setCurrentActivityIndex(index);
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <MathLearningLoading studentName={studentName} />
    );
  }

  // If no current activity but not initializing, show error
  if (!currentActivity) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-2">No Activities Available</h3>
          <p className="text-red-300">Please try refreshing the lesson, {studentName}.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Refresh Lesson
          </button>
        </div>
      </div>
    );
  }

  // Show the main content directly - NO welcome screens
  return (
    <MathLearningMainContent
      studentName={studentName}
      timeElapsed={timeElapsed}
      targetLessonLength={targetLessonLength}
      score={score}
      currentActivityIndex={currentActivityIndex}
      totalRealActivities={totalRealActivities}
      correctStreak={correctStreak}
      currentActivity={currentActivity}
      isSpeaking={isSpeaking}
      onBackToProgram={handleBackToProgram}
      onToggleMute={toggleMute}
      onReadRequest={handleReadRequest}
      onStopSpeaking={() => {
        console.log('🔇 [MathLearning] Stop speaking button - force stopping');
        forceStopAll();
      }}
      onActivityComplete={handleActivityComplete}
      onNavigateToActivity={handleNavigateToActivity}
      canNavigateBack={canNavigateBack}
      canNavigateForward={canNavigateForward}
      isCurrentActivityCompleted={isCurrentActivityCompleted}
    />
  );
};

export default OptimizedMathLearningContent;
