
import { useState } from 'react';
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
  const { stop: stopSpeaking } = useUnifiedSpeech();

  // Set up speech cleanup
  useSpeechCleanup(stopSpeaking);

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
      stopSpeaking(); // Stop speech before navigating back
      onBackToProgram();
    }
  });

  const handleBackToProgram = () => {
    stopSpeaking(); // Stop speech before navigating back
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
      onStopSpeaking={stopSpeaking}
      onActivityComplete={handleActivityComplete}
    />
  );
};

export default OptimizedMathLearningContent;
