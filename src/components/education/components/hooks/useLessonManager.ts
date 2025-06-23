import { useState, useCallback, useEffect } from 'react';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { 
  createMathematicsLesson
} from '../lessons/MathematicsLessons';
import { englishLessons } from '../lessons/EnglishLessons';
import { createScienceLesson } from '../lessons/ScienceLessons';
import { createMusicLesson } from '../lessons/MusicLessons';
import { createComputerScienceLesson } from '../lessons/ComputerScienceLessons';
import { createCreativeArtsLesson } from '../lessons/CreativeArtsLessons';
import { LessonActivity } from '../types/LessonTypes';

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
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);

  // Enhanced teaching engine configuration
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    timeElapsed: Math.floor((Date.now() - lessonStartTime) / 1000),
    correctStreak,
    score,
    lessonStartTime
  });

  // Generate optimized lesson activities for faster learning (15-18 minutes)
  const [lessonActivities] = useState<LessonActivity[]>(() => {
    console.log('🚀 Creating enhanced 15-18 minute lesson for subject:', subject);
    
    let activities: LessonActivity[] = [];
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        activities = createMathematicsLesson(skillArea);
        break;
      case 'english':
        activities = englishLessons;
        break;
      case 'science':
        activities = createScienceLesson(skillArea);
        break;
      case 'music':
        activities = createMusicLesson(skillArea);
        break;
      case 'computer-science':
        activities = createComputerScienceLesson(skillArea);
        break;
      case 'creative-arts':
        activities = createCreativeArtsLesson(skillArea);
        break;
      default:
        console.log('⚠️ Unknown subject, using mathematics lesson');
        activities = createMathematicsLesson(skillArea);
    }

    // Enhance all activities with the teaching engine
    return activities.map(activity => teachingEngine.enhanceActivityContent(activity));
  });

  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  console.log(`🧠 Enhanced lesson: ${lessonActivities.length} activities, optimized for accelerated learning`);

  // Enhanced auto-speak with subject-specific welcome
  useEffect(() => {
    if (currentActivity && teachingEngine.autoReadEnabled && teachingEngine.isReady && teachingEngine.hasUserInteracted) {
      console.log('🎯 Enhanced Nelie speaking for:', currentActivity.title);
      
      setTimeout(() => {
        let speechText = '';
        let context: 'explanation' | 'question' | 'encouragement' | 'humor' = 'explanation';
        
        if (currentActivity.phase === 'introduction') {
          speechText = currentActivity.content.hook || `Welcome to an incredible ${subject} adventure! Get ready to learn faster than ever before!`;
          context = 'humor';
        } else if (currentActivity.phase === 'content-delivery') {
          speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
          context = 'explanation';
        } else if (currentActivity.phase === 'interactive-game') {
          speechText = currentActivity.content.question || '';
          context = 'question';
        } else if (currentActivity.phase === 'application') {
          speechText = `Time for an amazing learning game! ${currentActivity.content.scenario || currentActivity.content.text || currentActivity.title}`;
          context = 'humor';
        } else {
          speechText = `Let's explore: ${currentActivity.title}`;
          context = 'explanation';
        }
        
        if (speechText) {
          console.log('🔊 Enhanced speaking with personality:', speechText.substring(0, 50));
          teachingEngine.speakWithPersonality(speechText, context);
        }
      }, 800); // Faster response time
    }
  }, [currentActivityIndex, currentActivity, teachingEngine]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    const responseTime = Date.now() - lessonStartTime - (timeElapsed * 1000);
    setLastResponseTime(responseTime);
    
    console.log('✅ Enhanced activity completed:', currentActivity?.id, 'Correct:', wasCorrect, 'Time:', responseTime);
    
    if (wasCorrect === true) {
      setScore(prev => prev + 15); // Higher score rewards
      setCorrectStreak(prev => prev + 1);
      
      // Adjust teaching speed based on performance
      teachingEngine.adjustTeachingSpeed(true, responseTime);
      
      setTimeout(() => {
        const celebration = teachingEngine.generateEncouragement(true, correctStreak + 1);
        console.log('🎉 Enhanced celebration:', celebration);
        teachingEngine.speakWithPersonality(celebration, 'encouragement');
      }, 600);
    } else if (wasCorrect === false) {
      setCorrectStreak(0);
      teachingEngine.adjustTeachingSpeed(false, responseTime);
      
      setTimeout(() => {
        const encouragement = teachingEngine.generateEncouragement(false, 0);
        console.log('💪 Enhanced encouragement:', encouragement);
        teachingEngine.speakWithPersonality(encouragement, 'encouragement');
      }, 600);
    }

    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        console.log('📚 Moving to next enhanced activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🏁 Enhanced lesson completed!');
        const finalMinutes = Math.round(timeElapsed / 60);
        setTimeout(() => {
          const completionMessage = `Absolutely incredible! You've mastered your ${finalMinutes}-minute ${subject} lesson! You're becoming such an amazing learner, and I'm so proud of your progress!`;
          teachingEngine.speakWithPersonality(completionMessage, 'encouragement');
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 4000);
      }
    }, wasCorrect !== undefined ? 2500 : 1200); // Faster transitions
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, teachingEngine, currentActivity, timeElapsed, subject, correctStreak, lessonStartTime]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (teachingEngine.isSpeaking) {
        console.log('🔇 User requested to stop enhanced Nelie');
        teachingEngine.stopSpeaking();
        return;
      }
      
      let speechText = '';
      let context: 'explanation' | 'question' | 'encouragement' | 'humor' = 'explanation';
      
      if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || `Welcome to your enhanced ${subject} class!`;
        context = 'humor';
      } else if (currentActivity.phase === 'content-delivery') {
        speechText = currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || '';
        context = 'explanation';
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = currentActivity.content.question || '';
        context = 'question';
      } else if (currentActivity.phase === 'application') {
        speechText = `Let's play this amazing game! ${currentActivity.content.scenario || currentActivity.content.text || ''}`;
        context = 'humor';
      } else {
        speechText = `Let me explain this exciting topic: ${currentActivity.title}`;
        context = 'explanation';
      }
      
      console.log('🔊 Enhanced manual repeat request:', speechText.substring(0, 50));
      teachingEngine.speakWithPersonality(speechText, context);
    }
  }, [currentActivity, teachingEngine, subject]);

  return {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    totalEstimatedTime: lessonActivities.reduce((total, activity) => total + activity.duration, 0),
    score,
    correctStreak,
    engagementLevel: teachingEngine.engagementLevel,
    adaptiveSpeed: teachingEngine.adaptiveSpeed,
    isSpeaking: teachingEngine.isSpeaking,
    autoReadEnabled: teachingEngine.autoReadEnabled,
    hasUserInteracted: teachingEngine.hasUserInteracted,
    isReady: teachingEngine.isReady,
    speakText: teachingEngine.speakWithPersonality,
    stopSpeaking: teachingEngine.stopSpeaking,
    toggleMute: teachingEngine.toggleMute,
    handleActivityComplete,
    handleReadRequest
  };
};
