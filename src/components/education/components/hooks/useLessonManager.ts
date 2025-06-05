
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

  // Generate comprehensive lesson activities for 20-25 minutes
  const [lessonActivities] = useState<LessonActivity[]>(() => {
    console.log('🎯 Creating comprehensive 20-25 minute lesson for subject:', subject);
    
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

  // Calculate total estimated lesson time (sum of all activity durations)
  const totalEstimatedTime = lessonActivities.reduce((total, activity) => total + activity.duration, 0);

  console.log(`📚 Lesson structure: ${lessonActivities.length} activities, estimated ${Math.round(totalEstimatedTime / 60)} minutes`);

  // Enhanced auto-speak with faster, more natural delivery
  useEffect(() => {
    if (currentActivity && autoReadEnabled && isReady && hasUserInteracted) {
      console.log('🎯 New activity - Nelie will speak with enhanced delivery:', currentActivity.title);
      
      setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.type === 'welcome') {
          speechText = currentActivity.content.message || `Welcome to an amazing ${subject} adventure!`;
        } else if (currentActivity.type === 'explanation') {
          speechText = `Let me explain this exciting concept: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's a fun question for you: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'game') {
          speechText = `Time for an exciting game! ${currentActivity.content.question || currentActivity.content.text || currentActivity.title}`;
        } else {
          speechText = `Let's explore: ${currentActivity.title}`;
        }
        
        if (speechText) {
          console.log('🔊 Enhanced auto-speaking:', speechText.substring(0, 50));
          speakText(speechText, true);
        }
      }, 1000); // Reduced delay for faster lesson flow
    }
  }, [currentActivityIndex, currentActivity, autoReadEnabled, isReady, hasUserInteracted, speakText, subject]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('✅ Activity completed:', currentActivity?.id, 'Correct:', wasCorrect);
    
    if (wasCorrect === true) {
      setScore(prev => prev + 10);
      
      const celebrations = [
        "Fantastic work! You're absolutely brilliant!",
        "Amazing! You're becoming such a smart learner!",
        "Excellent job! Keep up the wonderful work!",
        "Outstanding! You're doing so incredibly well!",
        "Brilliant thinking! I'm so proud of you!",
        "Wow! You're really mastering this subject!"
      ];
      
      setTimeout(() => {
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        console.log('🎉 Speaking celebration:', celebration);
        speakText(celebration, true);
      }, 800);
    } else if (wasCorrect === false) {
      const encouragements = [
        "That's okay! Learning means trying new things. Let's keep going!",
        "Good try! Every mistake helps us learn something new!",
        "No worries! You're doing great by thinking it through!"
      ];
      
      setTimeout(() => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        console.log('💪 Speaking encouragement:', encouragement);
        speakText(encouragement, true);
      }, 800);
    }

    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        console.log('📚 Moving to next activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🏁 Comprehensive lesson completed!');
        const finalMinutes = Math.round(timeElapsed / 60);
        setTimeout(() => {
          speakText(`Congratulations! You've completed your ${finalMinutes}-minute ${subject} lesson! You're becoming such an amazing learner!`, true);
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 5000);
      }
    }, wasCorrect !== undefined ? 3000 : 1500); // Longer pause for questions with feedback
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, speakText, currentActivity, timeElapsed, subject]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        console.log('🔇 User requested to stop Nelie');
        return;
      }
      
      let speechText = '';
      
      if (currentActivity.type === 'welcome') {
        speechText = currentActivity.content.message || `Welcome to your ${subject} class!`;
      } else if (currentActivity.type === 'explanation') {
        speechText = `Let me explain: ${currentActivity.content.text}`;
      } else if (currentActivity.type === 'question') {
        speechText = `Here's your question: ${currentActivity.content.question}`;
      } else if (currentActivity.type === 'game') {
        speechText = `Let's play this game! ${currentActivity.content.question || currentActivity.content.text}`;
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
    totalEstimatedTime,
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
