import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonTimer } from '../../hooks/useLessonTimer';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { LessonActivity } from '../types/LessonTypes';

interface UseStableLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  manualActivityIndex?: number | null;
}

// Generate diverse lesson activities following the established template
const generateTemplateBasedActivities = (subject: string): LessonActivity[] => {
  const activities: LessonActivity[] = [];
  const lessonId = `lesson-${Date.now()}`;

  // Follow the established 20-minute lesson template structure
  
  // 1. Engaging Introduction (2-3 minutes)
  activities.push({
    id: `${lessonId}_intro`,
    title: `Welcome to ${subject} Adventure!`,
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 180,
    metadata: { subject, skillArea: 'introduction' },
    content: {
      segments: [{
        concept: `${subject} Introduction`,
        explanation: `Welcome! Today we're going on an exciting ${subject} journey. Let's explore amazing concepts together and have fun learning!`
      }]
    }
  });

  // 2. Core Content Delivery (5-7 minutes) - Mixed topics
  activities.push({
    id: `${lessonId}_content_1`,
    title: 'Addition Fun',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'addition' },
    content: {
      question: 'Emma has 15 stickers and finds 12 more. How many stickers does she have now?',
      options: ['27', '25', '30', '23'],
      correctAnswer: 0,
      explanation: 'Emma started with 15 stickers and found 12 more. So 15 + 12 = 27 stickers total!'
    }
  });

  // 3. Interactive Learning Game - Different topic
  activities.push({
    id: `${lessonId}_game_1`,
    title: 'Subtraction Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'subtraction' },
    content: {
      question: 'Jake has 45 marbles and gives 18 to his friend. How many marbles does Jake have left?',
      options: ['27', '23', '29', '25'],
      correctAnswer: 0,
      explanation: 'Jake had 45 marbles and gave away 18. So 45 - 18 = 27 marbles left!'
    }
  });

  // 4. Application & Problem-Solving - Multiplication
  activities.push({
    id: `${lessonId}_application_1`,
    title: 'Multiplication Magic',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'multiplication' },
    content: {
      question: 'A classroom has 6 rows of desks with 5 desks in each row. How many desks are there in total?',
      options: ['30', '28', '32', '25'],
      correctAnswer: 0,
      explanation: 'There are 6 rows with 5 desks each. So 6 × 5 = 30 desks total!'
    }
  });

  // 5. Creative/Exploratory Element - Division
  activities.push({
    id: `${lessonId}_creative_1`,
    title: 'Division Discovery',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'division' },
    content: {
      question: 'There are 48 cookies to be shared equally among 8 children. How many cookies will each child get?',
      options: ['6', '5', '7', '8'],
      correctAnswer: 0,
      explanation: 'We have 48 cookies for 8 children. So 48 ÷ 8 = 6 cookies each!'
    }
  });

  // 6. Pattern Recognition Game
  activities.push({
    id: `${lessonId}_patterns_1`,
    title: 'Number Patterns',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'patterns' },
    content: {
      question: 'What comes next in this pattern: 5, 10, 15, 20, ?',
      options: ['25', '22', '30', '24'],
      correctAnswer: 0,
      explanation: 'This pattern increases by 5 each time: 5, 10, 15, 20, 25!'
    }
  });

  // 7. Problem Solving Challenge - Fractions
  activities.push({
    id: `${lessonId}_fractions_1`,
    title: 'Fraction Fun',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 240,
    metadata: { subject, skillArea: 'fractions' },
    content: {
      question: 'Sarah ate 2/8 of a pizza. How much pizza is left?',
      options: ['6/8', '4/8', '3/8', '5/8'],
      correctAnswer: 0,
      explanation: 'Sarah ate 2/8, so 8/8 - 2/8 = 6/8 of the pizza is left!'
    }
  });

  // 8. Summary & Celebration
  activities.push({
    id: `${lessonId}_summary`,
    title: 'Lesson Complete!',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 120,
    metadata: { subject, skillArea: 'summary' },
    content: {
      segments: [{
        concept: 'Lesson Summary',
        explanation: "Fantastic work! You've completed an amazing variety of math challenges today. You practiced addition, subtraction, multiplication, division, patterns, and fractions!"
      }]
    }
  });

  return activities;
};

export const useStableLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  manualActivityIndex
}: UseStableLessonManagerProps) => {
  const { user } = useAuth();
  const [allActivities] = useState(() => generateTemplateBasedActivities(subject));
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [isInitializing, setIsInitializing] = useState(false);

  const { sessionTimer, startTimer, stopTimer } = useLessonTimer();
  const { speakAsNelie, isSpeaking, isEnabled, toggleEnabled, forceStopAll } = useUnifiedSpeech();

  const targetLessonLength = 1200; // 20 minutes as per template
  const currentActivity = allActivities[currentActivityIndex] || null;

  // Use manual index if provided
  useEffect(() => {
    if (manualActivityIndex !== null && manualActivityIndex !== undefined) {
      setCurrentActivityIndex(manualActivityIndex);
    }
  }, [manualActivityIndex]);

  // Start timer when component mounts
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
      forceStopAll();
    };
  }, [startTimer, stopTimer, forceStopAll]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('🎯 Activity completion:', {
      currentActivityIndex,
      wasCorrect,
      totalActivities: allActivities.length
    });

    // Mark activity as completed
    setCompletedActivities(prev => new Set([...prev, currentActivityIndex]));

    // Update score and streak
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setScore(prev => prev + 1);
        setCorrectStreak(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Check if this is the last activity
    if (currentActivityIndex >= allActivities.length - 1) {
      console.log('🎓 Lesson completed - all activities finished');
      setTimeout(() => {
        onLessonComplete();
      }, 2000);
      return;
    }

    // Advance to next activity with delay
    setTimeout(() => {
      const nextIndex = currentActivityIndex + 1;
      console.log('➡️ Advancing to activity:', nextIndex);
      setCurrentActivityIndex(nextIndex);
    }, 2000);
  }, [currentActivityIndex, allActivities.length, onLessonComplete]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      const text = currentActivity.content.question || 
                  currentActivity.content.segments?.[0]?.explanation || 
                  currentActivity.title;
      
      if (isSpeaking) {
        forceStopAll();
      } else {
        speakAsNelie(text, true);
      }
    }
  }, [currentActivity, isSpeaking, speakAsNelie, forceStopAll]);

  return {
    currentActivityIndex,
    currentActivity,
    totalRealActivities: allActivities.length,
    timeElapsed: sessionTimer,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    isCurrentActivityCompleted: completedActivities.has(currentActivityIndex),
    canNavigateForward: currentActivityIndex < allActivities.length - 1,
    canNavigateBack: currentActivityIndex > 0,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute: toggleEnabled,
    setCurrentActivityIndex
  };
};
