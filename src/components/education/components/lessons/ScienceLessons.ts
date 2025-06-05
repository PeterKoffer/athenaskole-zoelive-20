
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createScienceLesson = (): LessonActivity[] => [
  createWelcomeActivity('science'),
  {
    id: 'science-explanation-1',
    type: 'explanation',
    title: 'Animal Habitats',
    duration: 10,
    content: {
      text: 'A habitat is where an animal lives and finds everything it needs - food, water, shelter, and space. Different animals need different types of homes!'
    }
  },
  {
    id: 'science-question-1',
    type: 'question',
    title: 'Where Do Animals Live?',
    duration: 30,
    content: {
      question: 'Where would you most likely find a polar bear?',
      options: ['Desert', 'Arctic ice', 'Rainforest', 'Ocean depths'],
      correctAnswer: 1,
      explanation: 'Fantastic! Polar bears live in the Arctic where there is lots of ice and snow. That\'s their perfect habitat!'
    }
  },
  {
    id: 'science-question-2',
    type: 'question',
    title: 'Plant Needs',
    duration: 30,
    content: {
      question: 'What do plants need to grow healthy and strong?',
      options: ['Only water', 'Only sunlight', 'Water, sunlight, and nutrients', 'Only soil'],
      correctAnswer: 2,
      explanation: 'Great job! Plants need water, sunlight, and nutrients from soil to grow big and healthy!'
    }
  }
];
