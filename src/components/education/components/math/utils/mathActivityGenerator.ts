
import { LessonActivity } from '../../types/LessonTypes';

// Generate math activities for the optimized lesson manager
export const generateMathActivities = async (): Promise<LessonActivity[]> => {
  // Return a set of math activities that match the LessonActivity type
  const activities: LessonActivity[] = [
    {
      id: 'math-intro',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Math Class',
      content: {
        text: 'Welcome to your math lesson! Today we\'ll be exploring different mathematical concepts.',
        question: 'Are you ready to start learning?'
      },
      duration: 2
    },
    {
      id: 'math-concept-1',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: 'Basic Math Concepts',
      content: {
        text: 'Let\'s start with some fundamental math concepts. We\'ll work through problems step by step.',
        question: 'What is 5 + 3?'
      },
      duration: 5
    },
    {
      id: 'math-interactive-1',
      type: 'interactive-game',
      phase: 'interactive-game',
      title: 'Math Practice Game',
      content: {
        text: 'Time for some interactive practice!',
        question: 'Solve the following problem:'
      },
      duration: 8
    },
    {
      id: 'math-explanation-1',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: 'Understanding Math Solutions',
      content: {
        text: 'Let me explain how we solve these types of problems.',
        question: 'Do you understand the solution method?'
      },
      duration: 4
    },
    {
      id: 'math-application-1',
      type: 'application',
      phase: 'application',
      title: 'Real-World Math Applications',
      content: {
        text: 'Now let\'s see how we can apply these concepts in real situations.',
        question: 'Can you think of a real-world example?'
      },
      duration: 6
    },
    {
      id: 'math-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Math Lesson Summary',
      content: {
        text: 'Great work! Let\'s review what we\'ve learned today.',
        question: 'What was your favorite part of today\'s lesson?'
      },
      duration: 3
    }
  ];

  return activities;
};
