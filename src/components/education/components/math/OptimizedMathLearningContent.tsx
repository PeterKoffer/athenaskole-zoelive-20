
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

  // Show loading ONLY when actually initializing
  if (isInitializing) {
    console.log('🔄 Showing loading screen - isInitializing:', isInitializing);
    return (
      <MathLearningLoading studentName={studentName} />
    );
  }

  // If initialization complete but no activity, show error
  if (!currentActivity) {
    console.log('❌ No current activity available');
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Activities</h3>
          <p className="text-red-300 mb-4">There was an issue loading your math activities, {studentName}.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-bold"
          >
            Refresh Lesson
          </button>
        </div>
      </div>
    );
  }

  // Show the main content - NO green boxes, NO welcome screens
  console.log('✅ Showing main content with activity:', currentActivity.id);
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
