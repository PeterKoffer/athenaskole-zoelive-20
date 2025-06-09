
import { useCallback } from 'react';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { LessonActivity } from '../types/LessonTypes';

interface UseLessonProgressionProps {
  subject: string;
  currentActivityIndex: number;
  allActivities: LessonActivity[];
  timeElapsed: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
  setCurrentActivityIndex: (value: React.SetStateAction<number>) => void;
  setScore: (value: React.SetStateAction<number>) => void;
  setCorrectStreak: (value: React.SetStateAction<number>) => void;
  setLastResponseTime: (value: React.SetStateAction<number>) => void;
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
  // Enhanced teaching engine configuration
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    difficulty: 3,
    studentEngagement: 75,
    learningSpeed: 'adaptive'
  });

  const currentActivity = allActivities[currentActivityIndex];

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    const responseTime = Date.now() - lessonStartTime - (timeElapsed * 1000);
    setLastResponseTime(responseTime);
    
    console.log('✅ Extended activity completed:', currentActivity?.id, 'Correct:', wasCorrect, 'Time:', responseTime);
    
    if (wasCorrect === true) {
      setScore(prev => prev + 15);
      setCorrectStreak(prev => prev + 1);
      
      teachingEngine.adjustTeachingSpeed(true, responseTime);
      
      setTimeout(() => {
        const celebration = teachingEngine.generateEncouragement(true, correctStreak + 1);
        console.log('🎉 Extended celebration:', celebration);
        teachingEngine.speakWithPersonality(celebration, 'encouragement');
      }, 800);
    } else if (wasCorrect === false) {
      setCorrectStreak(0);
      teachingEngine.adjustTeachingSpeed(false, responseTime);
      
      setTimeout(() => {
        const encouragement = teachingEngine.generateEncouragement(false, 0);
        console.log('💪 Extended encouragement:', encouragement);
        teachingEngine.speakWithPersonality(encouragement, 'encouragement');
      }, 800);
    }

    // Ensure lesson progresses properly
    setTimeout(() => {
      if (currentActivityIndex < allActivities.length - 1) {
        console.log('📚 Moving to next extended activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🏁 Extended lesson completed!');
        const finalMinutes = Math.round(timeElapsed / 60);
        setTimeout(() => {
          const completionMessage = `Outstanding work! You've completed your ${finalMinutes}-minute ${subject} lesson! You've really grown as a learner today, and I'm so proud of your dedication!`;
          teachingEngine.speakWithPersonality(completionMessage, 'encouragement');
        }, 1200);
        
        setTimeout(() => {
          onLessonComplete();
        }, 5000);
      }
    }, wasCorrect !== undefined ? 2500 : 1000); // Faster progression
  }, [currentActivityIndex, allActivities.length, onLessonComplete, teachingEngine, currentActivity, timeElapsed, subject, correctStreak, lessonStartTime, setCurrentActivityIndex, setScore, setCorrectStreak, setLastResponseTime]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (teachingEngine.isSpeaking) {
        console.log('🔇 User requested to stop extended Nelie');
        teachingEngine.stopSpeaking();
        return;
      }
      
      let speechText = '';
      let context: 'explanation' | 'question' | 'encouragement' | 'humor' = 'explanation';
      
      if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || `Welcome to your extended ${subject} lesson!`;
        context = 'humor';
      } else if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
        context = 'explanation';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
        context = 'question';
      } else {
        speechText = `Let me explain this step by step: ${currentActivity.title}`;
        context = 'explanation';
      }
      
      console.log('🔊 Extended manual repeat request:', speechText.substring(0, 50));
      teachingEngine.speakWithPersonality(speechText, context);
    }
  }, [currentActivity, teachingEngine, subject]);

  return {
    teachingEngine,
    currentActivity,
    handleActivityComplete,
    handleReadRequest
  };
};
