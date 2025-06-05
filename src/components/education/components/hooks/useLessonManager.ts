
import { useState, useCallback, useEffect } from 'react';
import { useWorkingSpeech } from '@/components/adaptive-learning/hooks/useWorkingSpeech';
import { createMathematicsLesson, createEnglishLesson, createScienceLesson, LessonActivity } from '../EnhancedLessonContent';

interface UseLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useLessonManager = ({
  subject,
  skillArea,
  onLessonComplete
}: UseLessonManagerProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  const {
    isSpeaking,
    autoReadEnabled,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech
  } = useWorkingSpeech();

  // Generate lesson content based on subject
  const generateLessonActivities = useCallback((): LessonActivity[] => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return createMathematicsLesson();
      case 'english':
        return createEnglishLesson();
      case 'science':
        return createScienceLesson();
      default:
        return createMathematicsLesson(); // fallback
    }
  }, [subject]);

  const [lessonActivities] = useState(generateLessonActivities());
  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  // Test speech when component mounts and speech is ready
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      console.log('🧪 Lesson Manager - Speech system is ready, testing in 3 seconds...');
      setTimeout(() => {
        console.log('🧪 Running initial speech test...');
        testSpeech();
      }, 3000);
    }
  }, [isReady, autoReadEnabled, testSpeech]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('✅ Activity completed, wasCorrect:', wasCorrect);
    
    if (wasCorrect === true) {
      setTotalCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 10);
      
      // Nelie celebrates correct answers
      const celebrations = [
        "Fantastic work! You're absolutely brilliant!",
        "Amazing! You're becoming such a great learner!",
        "Wonderful! Your thinking is incredible!",
        "Excellent! I'm so proud of you!",
        "Outstanding! You're a true champion!"
      ];
      
      setTimeout(() => {
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        console.log('🎉 Nelie celebrating:', celebration);
        speakText(celebration, true);
      }, 1000);
    }

    // Move to next activity after a brief pause
    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        console.log('📍 Moving to next activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🎉 Lesson complete!');
        
        // Final celebration from Nelie
        setTimeout(() => {
          const finalMessage = "You've completed your lesson! You did absolutely amazing work today. I'm so proud of how much you've learned!";
          console.log('🎓 Final message:', finalMessage);
          speakText(finalMessage, true);
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 4000);
      }
    }, 2000);
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, speakText]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        let speechText = '';
        
        if (currentActivity.type === 'explanation') {
          speechText = `Let me explain: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your question: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Let's play a game! ${currentActivity.content.text || currentActivity.title}`;
        } else {
          speechText = `Let me read this for you: ${currentActivity.title}`;
        }
        
        console.log('🔊 Manual read request:', speechText.substring(0, 50));
        speakText(speechText, true);
      }
    }
  }, [currentActivity, isSpeaking, speakText, stopSpeaking]);

  return {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    score,
    totalCorrectAnswers,
    isSpeaking,
    autoReadEnabled,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    testSpeech,
    handleActivityComplete,
    handleReadRequest
  };
};
