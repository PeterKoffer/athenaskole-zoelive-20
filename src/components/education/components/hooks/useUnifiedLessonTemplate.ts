
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLessonTimer } from '../../hooks/useLessonTimer';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { LessonActivity } from '../types/LessonTypes';

interface UseUnifiedLessonTemplateProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
}

// Generate consistent lesson structure for ALL subjects
const generateUnifiedLessonActivities = (subject: string, skillArea: string): LessonActivity[] => {
  const activities: LessonActivity[] = [];
  const lessonId = `unified-${subject}-${Date.now()}`;
  const subjectTitle = subject.charAt(0).toUpperCase() + subject.slice(1);

  // 1. Welcome Introduction (consistent across all subjects)
  activities.push({
    id: `${lessonId}_welcome`,
    title: `Welcome to ${subjectTitle} with Nelie!`,
    type: 'introduction',
    phase: 'introduction', 
    duration: 180,
    phaseDescription: `Welcome to your ${subjectTitle} learning adventure`,
    metadata: { subject, skillArea: 'welcome' },
    content: {
      text: `Hello! I'm Nelie, and I'm so excited to learn ${subjectTitle} with you today! We'll explore amazing concepts, solve fun problems, play educational games, and discover how ${subjectTitle} connects to the real world. Are you ready for this adventure?`
    }
  });

  // 2-4. Interactive Questions (subject-specific)
  const questionTopics = getSubjectQuestions(subject);
  questionTopics.forEach((topic, index) => {
    activities.push({
      id: `${lessonId}_question_${index + 1}`,
      title: topic.title,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 240,
      phaseDescription: topic.description,
      metadata: { subject, skillArea: topic.skillArea },
      content: {
        question: topic.question,
        options: topic.options,
        correctAnswer: topic.correctAnswer,
        explanation: topic.explanation
      }
    });
  });

  // 5. Educational Game/Assignment
  activities.push({
    id: `${lessonId}_game`,
    title: `${subjectTitle} Challenge Game`,
    type: 'creative-exploration',
    phase: 'creative-exploration',
    duration: 300,
    phaseDescription: `Interactive ${subjectTitle} challenge`,
    metadata: { subject, skillArea: 'game' },
    content: {
      creativePrompt: `Let's play a fun ${subjectTitle} game! I'll give you different scenarios where you can use your ${subjectTitle} skills creatively.`,
      whatIfScenario: getSubjectScenario(subject),
      explorationTask: `Think about how ${subjectTitle} helps us solve real-world problems!`
    }
  });

  // 6. Application Assignment
  activities.push({
    id: `${lessonId}_assignment`,
    title: `Real-World ${subjectTitle}`,
    type: 'application',
    phase: 'application',
    duration: 240,
    phaseDescription: `Apply ${subjectTitle} to real situations`,
    metadata: { subject, skillArea: 'application' },
    content: {
      scenario: getSubjectApplicationScenario(subject),
      task: `Use your ${subjectTitle} knowledge to solve this real-world challenge!`,
      guidance: `Take your time and think through each step. Remember what we've learned today!`
    }
  });

  // 7. Celebration Summary
  activities.push({
    id: `${lessonId}_celebration`,
    title: `Amazing Work in ${subjectTitle}!`,
    type: 'summary',
    phase: 'summary',
    duration: 180,
    phaseDescription: 'Celebrate your learning achievements',
    metadata: { subject, skillArea: 'celebration' },
    content: {
      keyTakeaways: [
        `You explored fascinating ${subjectTitle} concepts today!`,
        `You solved challenging problems with confidence!`,
        `You discovered how ${subjectTitle} connects to everyday life!`,
        `You're becoming an amazing ${subjectTitle} learner!`
      ],
      nextTopicSuggestion: `Next time, we'll dive even deeper into ${subjectTitle} and discover more exciting concepts!`
    }
  });

  return activities;
};

// Subject-specific question generators
const getSubjectQuestions = (subject: string) => {
  const questionSets: Record<string, any[]> = {
    mathematics: [
      {
        title: 'Addition Adventure',
        skillArea: 'addition',
        description: 'Master addition with fun scenarios',
        question: 'Sarah has 24 stickers and her friend gives her 18 more. How many stickers does Sarah have now?',
        options: ['42', '40', '44', '38'],
        correctAnswer: 0,
        explanation: 'Sarah started with 24 stickers and got 18 more. So 24 + 18 = 42 stickers total!'
      },
      {
        title: 'Subtraction Detective',
        skillArea: 'subtraction', 
        description: 'Solve subtraction mysteries',
        question: 'A library has 85 books. If 29 books are checked out, how many books remain?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'The library had 85 books and 29 were taken. So 85 - 29 = 56 books remain!'
      },
      {
        title: 'Multiplication Magic',
        skillArea: 'multiplication',
        description: 'Discover the power of multiplication',
        question: 'A garden has 7 rows of flowers with 8 flowers in each row. How many flowers are there?',
        options: ['56', '54', '58', '52'],
        correctAnswer: 0,
        explanation: 'There are 7 rows with 8 flowers each. So 7 × 8 = 56 flowers total!'
      }
    ],
    science: [
      {
        title: 'Solar System Explorer',
        skillArea: 'astronomy',
        description: 'Journey through our solar system',
        question: 'Which planet is known as the "Red Planet"?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 0,
        explanation: 'Mars is called the Red Planet because of iron oxide (rust) on its surface!'
      },
      {
        title: 'Life Cycles Discovery',
        skillArea: 'biology',
        description: 'Explore how living things grow',
        question: 'What comes after the caterpillar stage in a butterfly\'s life cycle?',
        options: ['Chrysalis', 'Egg', 'Adult', 'Larva'],
        correctAnswer: 0,
        explanation: 'After the caterpillar stage, butterflies form a chrysalis (cocoon) before becoming adults!'
      },
      {
        title: 'Weather Wonders',
        skillArea: 'meteorology',
        description: 'Understand weather patterns',
        question: 'What type of cloud is most likely to produce rain?',
        options: ['Cumulus', 'Stratus', 'Cirrus', 'Nimbus'],
        correctAnswer: 3,
        explanation: 'Nimbus clouds are dark, thick clouds that bring rain and storms!'
      }
    ],
    english: [
      {
        title: 'Grammar Detective',
        skillArea: 'grammar',
        description: 'Master the rules of language',
        question: 'Which sentence uses the correct verb tense?',
        options: ['She walk to school yesterday', 'She walked to school yesterday', 'She walking to school yesterday', 'She walks to school yesterday'],
        correctAnswer: 1,
        explanation: 'For past events, we use past tense verbs. "Walked" is the past tense of "walk"!'
      },
      {
        title: 'Vocabulary Builder',
        skillArea: 'vocabulary',
        description: 'Expand your word power',
        question: 'What does the word "jubilant" mean?',
        options: ['Very happy', 'Very sad', 'Very tired', 'Very angry'],
        correctAnswer: 0,
        explanation: 'Jubilant means extremely happy and joyful, like celebrating a big victory!'
      },
      {
        title: 'Reading Comprehension',
        skillArea: 'reading',
        description: 'Understand what you read',
        question: 'In a story, what is the main character usually called?',
        options: ['Protagonist', 'Antagonist', 'Narrator', 'Author'],
        correctAnswer: 0,
        explanation: 'The protagonist is the main character who drives the story forward!'
      }
    ]
  };

  return questionSets[subject] || questionSets.mathematics;
};

const getSubjectScenario = (subject: string): string => {
  const scenarios: Record<string, string> = {
    mathematics: 'What if you were running a pizza shop and needed to calculate how many pizzas to make for different sized parties?',
    science: 'What if you were a scientist discovering a new planet? What would you want to learn about it first?',
    english: 'What if you were writing a story about a magical adventure? What characters and setting would you create?'
  };
  return scenarios[subject] || scenarios.mathematics;
};

const getSubjectApplicationScenario = (subject: string): string => {
  const scenarios: Record<string, string> = {
    mathematics: 'Your family is planning a picnic for 24 people. Each person will eat 2 sandwiches and drink 3 cups of juice. How much food and drink do you need to buy?',
    science: 'You notice your houseplant is wilting. Using what you know about plant needs, what steps would you take to help it grow healthy again?',
    english: 'You need to write a thank-you letter to your grandmother. How would you organize your thoughts and express your feelings clearly?'
  };
  return scenarios[subject] || scenarios.mathematics;
};

export const useUnifiedLessonTemplate = ({
  subject,
  skillArea,
  onLessonComplete
}: UseUnifiedLessonTemplateProps) => {
  const { user } = useAuth();
  const [allActivities] = useState(() => generateUnifiedLessonActivities(subject, skillArea));
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());

  const { sessionTimer, startTimer, stopTimer } = useLessonTimer();
  const { speakAsNelie, isSpeaking, isEnabled, toggleEnabled, forceStopAll } = useUnifiedSpeech();

  const targetLessonLength = 1200; // 20 minutes
  const currentActivity = allActivities[currentActivityIndex] || null;

  // Start timer when lesson begins
  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
      forceStopAll();
    };
  }, [startTimer, stopTimer, forceStopAll]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('🎯 Unified lesson activity completed:', {
      subject,
      activityIndex: currentActivityIndex,
      wasCorrect,
      activityTitle: currentActivity?.title
    });

    // Mark as completed
    setCompletedActivities(prev => new Set([...prev, currentActivityIndex]));

    // Update score and streak
    if (wasCorrect !== undefined) {
      if (wasCorrect) {
        setScore(prev => prev + 10);
        setCorrectStreak(prev => prev + 1);
      } else {
        setCorrectStreak(0);
      }
    }

    // Check if lesson is complete
    if (currentActivityIndex >= allActivities.length - 1) {
      console.log('🎓 Unified lesson completed for', subject);
      setTimeout(() => {
        onLessonComplete();
      }, 2000);
      return;
    }

    // Advance to next activity
    setTimeout(() => {
      setCurrentActivityIndex(prev => prev + 1);
    }, 2000);
  }, [currentActivityIndex, allActivities.length, currentActivity, subject, onLessonComplete]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      const text = currentActivity.content.question || 
                  currentActivity.content.text ||
                  currentActivity.content.creativePrompt ||
                  currentActivity.content.scenario ||
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
    isInitializing: false,
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
