
import { useState, useEffect } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import { useStudentName } from '../math/hooks/useStudentName';
import { useSpeechCleanup } from '../math/hooks/useSpeechCleanup';
import UniversalLearningIntroduction from './UniversalLearningIntroduction';
import UniversalLearningLoading from './UniversalLearningLoading';
import UniversalLearningMainContent from './UniversalLearningMainContent';
import type { LessonActivity } from '../types/LessonTypes'; // Added for predefinedActivities

interface UniversalLearningContentProps {
  subject: string;
  skillArea: string;
  onBackToProgram: () => void; // Original callback for when the whole lesson sequence is done
  predefinedActivities?: LessonActivity[]; // New prop for providing activities directly
  onLessonCompleteOverride?: () => void; // New callback for when predefined activities are done
}

const UniversalLearningContent = ({
  subject,
  skillArea,
  onBackToProgram,
  predefinedActivities,
  onLessonCompleteOverride,
}: UniversalLearningContentProps) => {
  // Introduction screen is typically for a full, generated lesson.
  // If activities are predefined (e.g., from an adventure chapter), we might skip it.
  const [showIntroduction, setShowIntroduction] = useState(!predefinedActivities || predefinedActivities.length === 0);
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
    // --- CONCEPTUAL CHANGE FOR useOptimizedLessonManager ---
    // The useOptimizedLessonManager hook should be updated to accept 'predefinedActivities'.
    // If 'predefinedActivities' is provided and non-empty, the hook should:
    // 1. Use these activities directly instead of calling DailyLessonGenerator.generateDailyLesson.
    // 2. Calculate totalRealActivities and targetLessonLength based on this array.
    // 3. Manage progression through this predefined set of activities.
    // If 'predefinedActivities' is not provided or is empty, it should fall back to its
    // existing behavior (calling DailyLessonGenerator).
    predefinedActivities: predefinedActivities,
    onLessonComplete: () => {
      console.log(`🔇 [${subject}Learning] Lesson sequence completing - stopping speech`);
      forceStopAll();
      if (onLessonCompleteOverride) {
        console.log(`Calling onLessonCompleteOverride for predefined activities.`);
        onLessonCompleteOverride();
      } else {
        onBackToProgram();
      }
    }
  });

  const handleBackToProgram = () => {
    console.log(`🔇 [${subject}Learning] Back to program - stopping speech`);
    forceStopAll();
    // If there's an override, it means we are in an embedded context.
    // 'Back' should probably also use the override to signal exiting the embedded lesson.
    if (onLessonCompleteOverride) {
        onLessonCompleteOverride();
    } else {
        onBackToProgram();
    }
  };

  const handleIntroductionComplete = () => {
    console.log(`🎭 ${subject} Introduction completed, starting optimized lesson`);
    setShowIntroduction(false);
  };

  // Show introduction first, only if not using predefined activities or if explicitly desired
  if (showIntroduction && (!predefinedActivities || predefinedActivities.length === 0)) {
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
