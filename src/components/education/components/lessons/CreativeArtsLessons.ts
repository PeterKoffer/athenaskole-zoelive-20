
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
      text: 'Primary colors are red, blue, and yellow! These are special colors because we can mix them together to create all other colors. They are like the building blocks of art - just like how letters make words!'
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
      explanation: 'Wonderful! Red and yellow make orange - just like a beautiful sunset or a pumpkin! Color mixing is like magic in art!'
    }
  },
  {
    id: 'art-explanation-2',
    type: 'explanation',
    title: 'Shapes in Art',
    duration: 10,
    content: {
      text: 'Artists use basic shapes like circles, squares, and triangles to create amazing artwork! Every drawing starts with simple shapes. Even the most complex paintings begin with these basic building blocks!'
    }
  },
  {
    id: 'art-question-2',
    type: 'question',
    title: 'Shape Recognition',
    duration: 30,
    content: {
      question: 'If you wanted to draw a house, which shapes would you use?',
      options: [
        'Only circles',
        'Square for the house and triangle for the roof',
        'Only triangles',
        'Only wavy lines'
      ],
      correctAnswer: 1,
      explanation: 'Excellent! A square makes a perfect house and a triangle creates a wonderful roof. Artists combine shapes to create beautiful pictures!'
    }
  }
];
