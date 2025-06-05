
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createMathematicsLesson = (): LessonActivity[] => [
  createWelcomeActivity('mathematics'),
  {
    id: 'math-explanation-1',
    type: 'explanation',
    title: 'Understanding Addition',
    duration: 10,
    content: {
      text: 'Addition is when we combine numbers to find their total. When we add 2 + 3, we get 5. Think of it like putting groups of objects together!'
    }
  },
  {
    id: 'math-question-1',
    type: 'question',
    title: 'Simple Addition',
    duration: 30,
    content: {
      question: 'What is 4 + 6?',
      options: ['8', '9', '10', '11'],
      correctAnswer: 2,
      explanation: 'Great! 4 + 6 = 10. You can count: 4, 5, 6, 7, 8, 9, 10!'
    }
  },
  {
    id: 'math-game-1',
    type: 'game',
    title: 'Number Pattern Detective Game',
    duration: 45,
    content: {
      text: 'Look at this pattern: 2, 4, 6, 8, ?. What number comes next?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Excellent! The pattern adds 2 each time, so 8 + 2 = 10!'
    }
  },
  {
    id: 'math-question-2',
    type: 'question',
    title: 'Math Story Adventure',
    duration: 30,
    content: {
      question: 'Maya went to the zoo and saw 12 monkeys playing in the trees. Then 4 monkeys went inside for lunch. How many monkeys were still playing outside?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      explanation: 'Perfect! 12 - 4 = 8 monkeys were still playing outside!'
    }
  }
];
