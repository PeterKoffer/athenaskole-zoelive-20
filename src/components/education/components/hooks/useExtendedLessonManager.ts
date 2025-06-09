
import { useState, useCallback, useEffect } from 'react';
import { useEnhancedTeachingEngine } from './useEnhancedTeachingEngine';
import { useDiverseQuestionGeneration } from '@/components/adaptive-learning/hooks/useDiverseQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';
import { 
  createMathematicsLesson
} from '../lessons/MathematicsLessons';
import { createEnglishLesson } from '../lessons/EnglishLessons';
import { createScienceLesson } from '../lessons/ScienceLessons';
import { createMusicLesson } from '../lessons/MusicLessons';
import { createComputerScienceLesson } from '../lessons/ComputerScienceLessons';
import { createCreativeArtsLesson } from '../lessons/CreativeArtsLessons';
import { LessonActivity } from '../types/LessonTypes';

interface UseExtendedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

export const useExtendedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete
}: UseExtendedLessonManagerProps) => {
  const { user } = useAuth();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [dynamicActivities, setDynamicActivities] = useState<LessonActivity[]>([]);
  const [targetLessonLength] = useState(18); // 18 minutes target
  const [questionsGenerated, setQuestionsGenerated] = useState(0);

  // Enhanced teaching engine configuration
  const teachingEngine = useEnhancedTeachingEngine({
    subject,
    difficulty: 3,
    studentEngagement: 75,
    learningSpeed: 'adaptive'
  });

  // Dynamic question generation
  const { generateDiverseQuestion } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: 3,
    userId: user?.id || '',
    gradeLevel: 5,
    standardsAlignment: { standard: { code: 'CCSS.ELA' } }
  });

  // Generate initial lesson activities (now longer baseline)
  const [baseLessonActivities] = useState<LessonActivity[]>(() => {
    console.log('🚀 Creating extended 18+ minute lesson for subject:', subject);
    
    let activities: LessonActivity[] = [];
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        activities = createMathematicsLesson();
        break;
      case 'english':
        activities = createEnglishLesson();
        break;
      case 'science':
        activities = createScienceLesson();
        break;
      case 'music':
        activities = createMusicLesson();
        break;
      case 'computer-science':
        activities = createComputerScienceLesson();
        break;
      case 'creative-arts':
        activities = createCreativeArtsLesson();
        break;
      default:
        activities = createEnglishLesson();
    }

    // Extend activities for longer lesson - double the practice questions
    const extendedActivities = [...activities];
    
    // Add more practice activities
    for (let i = 0; i < 4; i++) {
      extendedActivities.push({
        id: `extended-practice-${i}`,
        type: 'question',
        phase: 'interactive-game',
        title: `Practice Question ${i + 1}`,
        duration: 240, // 4 minutes each
        content: {
          question: `This will be dynamically generated based on your progress`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: 'Great job! Let\'s keep practicing.'
        }
      });
    }

    return extendedActivities.map(activity => ({
      ...teachingEngine.enhanceActivityContent(activity),
      duration: Math.max(activity.duration * 1.2, 180) // Minimum 3 minutes per activity
    }));
  });

  // Combine base activities with dynamic ones
  const allActivities = [...baseLessonActivities, ...dynamicActivities];
  const currentActivity = allActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  console.log(`🧠 Extended lesson: ${allActivities.length} activities, targeting ${targetLessonLength} minutes`);

  // Generate dynamic questions based on performance
  const generateDynamicActivity = useCallback(async () => {
    if (!user?.id) return null;

    try {
      console.log('🎯 Generating dynamic question based on student performance...');
      
      const question = await generateDiverseQuestion({
        previousPerformance: { accuracy: score / Math.max(currentActivityIndex, 1) * 100 },
        strugglingAreas: correctStreak < 2 ? [skillArea] : [],
        timeSpent: timeElapsed
      });

      const dynamicActivity: LessonActivity = {
        id: `dynamic-${questionsGenerated}-${Date.now()}`,
        type: 'question',
        phase: 'interactive-game',
        title: `Adaptive Practice Question ${questionsGenerated + 1}`,
        duration: 240, // 4 minutes
        content: {
          question: question.question,
          options: question.options,
          correct: question.correct,
          explanation: question.explanation
        }
      };

      setQuestionsGenerated(prev => prev + 1);
      console.log('✅ Dynamic activity generated:', dynamicActivity.title);
      return dynamicActivity;
    } catch (error) {
      console.error('❌ Failed to generate dynamic activity:', error);
      return null;
    }
  }, [user?.id, generateDiverseQuestion, skillArea, score, currentActivityIndex, timeElapsed, questionsGenerated]);

  // Check if we need to extend the lesson
  const shouldExtendLesson = useCallback(() => {
    const currentMinutes = timeElapsed / 60;
    const remainingActivities = allActivities.length - currentActivityIndex - 1;
    const estimatedRemainingTime = remainingActivities * 3; // 3 minutes per activity average
    
    return currentMinutes + estimatedRemainingTime < targetLessonLength;
  }, [timeElapsed, allActivities.length, currentActivityIndex, targetLessonLength]);

  // Auto-generate more activities if lesson is too short
  useEffect(() => {
    if (currentActivityIndex > 2 && shouldExtendLesson() && dynamicActivities.length < 6) {
      console.log('📚 Lesson seems short, generating additional content...');
      generateDynamicActivity().then(newActivity => {
        if (newActivity) {
          setDynamicActivities(prev => [...prev, newActivity]);
        }
      });
    }
  }, [currentActivityIndex, shouldExtendLesson, dynamicActivities.length, generateDynamicActivity]);

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
      }, 800); // Slower pace
    } else if (wasCorrect === false) {
      setCorrectStreak(0);
      teachingEngine.adjustTeachingSpeed(false, responseTime);
      
      setTimeout(() => {
        const encouragement = teachingEngine.generateEncouragement(false, 0);
        console.log('💪 Extended encouragement:', encouragement);
        teachingEngine.speakWithPersonality(encouragement, 'encouragement');
      }, 800);
    }

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
    }, wasCorrect !== undefined ? 3000 : 1500); // Slower transitions
  }, [currentActivityIndex, allActivities.length, onLessonComplete, teachingEngine, currentActivity, timeElapsed, subject, correctStreak, lessonStartTime]);

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
    currentActivityIndex,
    lessonActivities: allActivities,
    currentActivity,
    timeElapsed,
    totalEstimatedTime: allActivities.reduce((total, activity) => total + activity.duration, 0),
    score,
    correctStreak,
    questionsGenerated,
    targetLessonLength,
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
