
import { useState, useEffect } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import { useStudentName } from '../math/hooks/useStudentName';
import { useSpeechCleanup } from '../math/hooks/useSpeechCleanup';
import UniversalLearningIntroduction from './UniversalLearningIntroduction';
import UniversalLearningLoading from './UniversalLearningLoading';
import UniversalLearningMainContent from './UniversalLearningMainContent';

interface UniversalLearningContentProps {
  subject: string;
  skillArea: string;
  onBackToProgram: () => void;
}

const UniversalLearningContent = ({ subject, skillArea, onBackToProgram }: UniversalLearningContentProps) => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const studentName = useStudentName();
  const { stop: stopSpeaking, forceStopAll } = useUnifiedSpeech();

  // Enhanced speech cleanup for all navigation scenarios
  useSpeechCleanup(() => {
    console.log(`🔇 [${subject}Learning] Cleanup triggered - force stopping all speech`);
    forceStopAll();
  });

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`🔇 [${subject}Learning] Component unmounting - force stopping speech`);
      forceStopAll();
    };
  }, [forceStopAll, subject]);

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
    subject: subject,
    skillArea: skillArea,
    onLessonComplete: () => {
      console.log(`🔇 [${subject}Learning] Lesson completing - stopping speech`);
      forceStopAll();
      onBackToProgram();
    }
  });

  const handleBackToProgram = () => {
    console.log(`🔇 [${subject}Learning] Back to program - stopping speech`);
    forceStopAll();
    onBackToProgram();
  };

  const handleIntroductionComplete = () => {
    console.log(`🎭 ${subject} Introduction completed, starting optimized lesson`);
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <UniversalLearningIntroduction 
        subject={subject}
        skillArea={skillArea}
        onIntroductionComplete={handleIntroductionComplete} 
      />
    );
  }

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <UniversalLearningLoading subject={subject} studentName={studentName} />
    );
  }

  return (
    <UniversalLearningMainContent
      subject={subject}
      skillArea={skillArea}
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
        console.log(`🔇 [${subject}Learning] Stop speaking button - force stopping`);
        forceStopAll();
      }}
      onActivityComplete={handleActivityComplete}
    />
  );
};

export default UniversalLearningContent;
