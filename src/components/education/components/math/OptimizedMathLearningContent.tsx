
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
