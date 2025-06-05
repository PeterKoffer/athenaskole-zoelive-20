
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createComputerScienceLesson = (): LessonActivity[] => [
  createWelcomeActivity('computer-science'),
  {
    id: 'cs-explanation-1',
    type: 'explanation',
    title: 'What is Programming?',
    duration: 10,
    content: {
      text: 'Programming is like giving instructions to a computer! We write step-by-step directions that tell the computer exactly what to do, just like following a recipe.'
    }
  },
  {
    id: 'cs-question-1',
    type: 'question',
    title: 'Computer Logic',
    duration: 30,
    content: {
      question: 'If you want a robot to make a sandwich, what should be the first step?',
      options: ['Eat the sandwich', 'Get the bread', 'Put on the roof', 'Dance'],
      correctAnswer: 1,
      explanation: 'Excellent thinking! Just like in programming, we need to start with the first logical step - getting the bread!'
    }
  }
];
