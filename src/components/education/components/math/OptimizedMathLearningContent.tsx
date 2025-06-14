
import { useState, useEffect } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import { useStudentName } from './hooks/useStudentName';
import { useSpeechCleanup } from './hooks/useSpeechCleanup';
import MathLearningIntroduction from './MathLearningIntroduction';
import MathLearningLoading from './MathLearningLoading';
import MathLearningMainContent from './MathLearningMainContent';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({ onBackToProgram }: OptimizedMathLearningContentProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const studentName = useStudentName();
  const { stop: stopSpeaking, forceStopAll } = useUnifiedSpeech();

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
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute
  } = useOptimizedLessonManager({
    subject: 'mathematics',
    skillArea: 'general_math',
    onLessonComplete: () => {
      console.log('🔇 [MathLearning] Lesson completing - stopping speech');
      forceStopAll();
      onBackToProgram();
    }
  });

  const handleBackToProgram = () => {
    console.log('🔇 [MathLearning] Back to program - stopping speech');
    forceStopAll();
    onBackToProgram();
  };

  const handleIntroductionComplete = () => {
    console.log('🎭 Introduction completed, starting optimized lesson');
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <MathLearningIntroduction onIntroductionComplete={handleIntroductionComplete} />
    );
  }

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
    />
  );
};

export default OptimizedMathLearningContent;
