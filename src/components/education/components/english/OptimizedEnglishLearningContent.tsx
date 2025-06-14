
import { useState } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import { useStudentName } from '../math/hooks/useStudentName';
import { useSpeechCleanup } from '../math/hooks/useSpeechCleanup';
import EnglishLearningIntroduction from './EnglishLearningIntroduction';
import EnglishLearningLoading from './EnglishLearningLoading';
import EnglishLearningMainContent from './EnglishLearningMainContent';

interface OptimizedEnglishLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedEnglishLearningContent = ({ onBackToProgram }: OptimizedEnglishLearningContentProps) => {
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
    subject: 'english',
    skillArea: 'creative_writing',
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
    console.log('🎭 Introduction completed, starting optimized English lesson');
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <EnglishLearningIntroduction onIntroductionComplete={handleIntroductionComplete} />
    );
  }

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <EnglishLearningLoading studentName={studentName} />
    );
  }

  return (
    <EnglishLearningMainContent
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

export default OptimizedEnglishLearningContent;
