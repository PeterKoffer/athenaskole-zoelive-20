
import { useMemo } from 'react';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';

interface LessonActivity {
  id: string;
  type: string;
  title: string;
  duration: number;
  content: any;
}

interface UseLessonProgressionProps {
  subject: string;
  currentActivityIndex: number;
  allActivities: LessonActivity[];
  timeElapsed: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
  setCurrentActivityIndex: (index: number) => void;
  setScore: (score: number) => void;
  setCorrectStreak: (streak: number) => void;
  setLastResponseTime: (time: Date | null) => void;
  onLessonComplete: () => void;
}

export const useLessonProgression = ({
  subject,
  currentActivityIndex,
  allActivities,
  timeElapsed,
  correctStreak,
  score,
  lessonStartTime,
  setCurrentActivityIndex,
  setScore,
  setCorrectStreak,
  setLastResponseTime,
  onLessonComplete
}: UseLessonProgressionProps) => {
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    currentActivityIndex,
    totalActivities: allActivities.length,
    timeElapsed,
    correctStreak,
    score,
    lessonStartTime
  });

  const currentActivity = useMemo(() => {
    return allActivities[currentActivityIndex] || null;
  }, [allActivities, currentActivityIndex]);

  const handleActivityComplete = (wasCorrect?: boolean) => {
    console.log('📚 Activity completed:', currentActivityIndex, wasCorrect);
    setLastResponseTime(new Date());
    
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setCorrectStreak(prev => prev + 1);
        setScore(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    const nextIndex = currentActivityIndex + 1;
    if (nextIndex >= allActivities.length || timeElapsed >= 20) {
      console.log('🎓 Lesson completed!');
      onLessonComplete();
    } else {
      console.log('➡️ Moving to next activity:', nextIndex);
      setCurrentActivityIndex(nextIndex);
    }
  };

  const handleReadRequest = () => {
    if (currentActivity && teachingEngine.isReady) {
      const textToRead = currentActivity.content?.text || 
                        currentActivity.content?.question || 
                        currentActivity.title;
      if (textToRead) {
        teachingEngine.speakWithPersonality(textToRead);
      }
    }
  };

  return {
    teachingEngine,
    currentActivity,
    handleActivityComplete,
    handleReadRequest
  };
};
