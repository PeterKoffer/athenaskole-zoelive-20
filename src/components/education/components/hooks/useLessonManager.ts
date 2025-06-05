
import { useState, useCallback, useEffect } from 'react';
import { useWorkingNelieSpeech } from '@/components/adaptive-learning/hooks/useWorkingNelieSpeech';
import { 
  createMathematicsLesson, 
  createEnglishLesson, 
  createScienceLesson, 
  createMusicLesson, 
  createComputerScienceLesson, 
  createCreativeArtsLesson, 
  LessonActivity 
} from '../EnhancedLessonContent';

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

  // Generate lesson activities based on subject
  const [lessonActivities] = useState<LessonActivity[]>(() => {
    console.log('🎯 Creating lesson for subject:', subject);
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return createMathematicsLesson();
      case 'english':
        return createEnglishLesson();
      case 'science':
        return createScienceLesson();
      case 'music':
        return createMusicLesson();
      case 'computer-science':
        return createComputerScienceLesson();
      case 'creative-arts':
        return createCreativeArtsLesson();
      default:
        console.log('⚠️ Unknown subject, using mathematics lesson');
        return createMathematicsLesson();
    }
  });

  const {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute
  } = useWorkingNelieSpeech();

  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  // Auto-speak activity content when activity changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && isReady && hasUserInteracted) {
      console.log('🎯 New activity - Nelie will speak:', currentActivity.title);
      
      setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.type === 'welcome') {
          speechText = currentActivity.content.message || `Welcome to ${subject} class!`;
        } else if (currentActivity.type === 'explanation') {
          speechText = `Let me explain: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your question: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Let's play a game! ${currentActivity.content.text || currentActivity.content.question}`;
        } else {
          speechText = `Let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          console.log('🔊 Auto-speaking activity:', speechText.substring(0, 50));
          speakText(speechText, true);
        }
      }, 1500);
    }
  }, [currentActivityIndex, currentActivity, autoReadEnabled, isReady, hasUserInteracted, speakText, subject]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('✅ Activity completed:', currentActivity?.id, 'Correct:', wasCorrect);
    
    if (wasCorrect === true) {
      setScore(prev => prev + 10);
      
      const celebrations = [
        "Fantastic work! You're absolutely brilliant!",
        "Amazing! You're becoming such a great learner!",
        "Excellent job! Keep up the wonderful work!",
        "Outstanding! You're doing so well!"
      ];
      
      setTimeout(() => {
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        console.log('🎉 Speaking celebration:', celebration);
        speakText(celebration, true);
      }, 1000);
    }

    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        console.log('📚 Moving to next activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🏁 Lesson completed!');
        setTimeout(() => {
          speakText("You've completed your lesson! Amazing work today!", true);
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 4000);
      }
    }, 2000);
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, speakText, currentActivity]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        console.log('🔇 User requested to stop Nelie');
        return;
      }
      
      let speechText = '';
      
      if (currentActivity.type === 'welcome') {
        speechText = currentActivity.content.message || `Welcome to ${subject} class!`;
      } else if (currentActivity.type === 'explanation') {
        speechText = `Let me explain: ${currentActivity.content.text}`;
      } else if (currentActivity.type === 'question') {
        speechText = `Here's your question: ${currentActivity.content.question}`;
      } else if (currentActivity.type === 'game') {
        speechText = `Let's play a game! ${currentActivity.content.text || currentActivity.content.question}`;
      } else {
        speechText = `Let me read this for you: ${currentActivity.title}`;
      }
      
      console.log('🔊 Manual repeat request:', speechText.substring(0, 50));
      speakText(speechText, true);
    }
  }, [currentActivity, isSpeaking, speakText, subject]);

  return {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    score,
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute,
    handleActivityComplete,
    handleReadRequest
  };
};
