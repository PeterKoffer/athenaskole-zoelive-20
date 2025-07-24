
import { useState, useEffect } from 'react';
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
  const { forceStopAll } = useUnifiedSpeech();
  const studentName = 'Student'; // Default student name

  // Enhanced speech cleanup for all navigation scenarios
  useSpeechCleanup(() => {
    console.log('🔇 [EnglishLearning] Cleanup triggered - force stopping all speech');
    forceStopAll();
  });

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🔇 [EnglishLearning] Component unmounting - force stopping speech');
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
    subject: 'english',
    skillArea: 'general_english',
    onLessonComplete: () => {
      console.log('🔇 [EnglishLearning] Lesson completing - stopping speech');
      forceStopAll();
      onBackToProgram();
    }
  });

  const handleBackToProgram = () => {
    console.log('🔇 [EnglishLearning] Back to program - stopping speech');
    forceStopAll();
    onBackToProgram();
  };

  const handleIntroductionComplete = () => {
    console.log('🎭 English Introduction completed, starting optimized lesson');
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
      onStopSpeaking={() => {
        console.log('🔇 [EnglishLearning] Stop speaking button - force stopping');
        forceStopAll();
      }}
      onActivityComplete={handleActivityComplete}
    />
  );
};

export default OptimizedEnglishLearningContent;
