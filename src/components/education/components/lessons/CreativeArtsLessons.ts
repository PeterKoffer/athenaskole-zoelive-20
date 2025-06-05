
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createCreativeArtsLesson = (): LessonActivity[] => [
  createWelcomeActivity('creative-arts'),
  {
    id: 'art-explanation-1',
    type: 'explanation',
    title: 'Primary Colors',
    duration: 10,
    content: {
      text: 'Primary colors are red, blue, and yellow! These are special colors because we can mix them together to create all other colors. They are like the building blocks of art!'
    }
  },
  {
    id: 'art-question-1',
    type: 'question',
    title: 'Color Mixing',
    duration: 30,
    content: {
      question: 'What color do you get when you mix red and yellow?',
      options: ['Purple', 'Orange', 'Green', 'Pink'],
      correctAnswer: 1,
      explanation: 'Wonderful! Red and yellow make orange - just like a beautiful sunset or a pumpkin!'
    }
  }
];
