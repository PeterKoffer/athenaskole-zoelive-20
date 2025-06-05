
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
      text: 'Programming is like giving instructions to a computer! We write step-by-step directions that tell the computer exactly what to do, just like following a recipe. When we program, we become the computer\'s teacher!'
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
      explanation: 'Excellent thinking! Just like in programming, we need to start with the first logical step - getting the bread! Programming is all about thinking step by step.'
    }
  },
  {
    id: 'cs-explanation-2',
    type: 'explanation',
    title: 'Algorithms Everywhere',
    duration: 10,
    content: {
      text: 'An algorithm is like a recipe or a set of instructions! We use algorithms every day - when we brush our teeth, make breakfast, or even tie our shoes. In computer science, algorithms help us solve problems step by step!'
    }
  },
  {
    id: 'cs-question-2',
    type: 'question',
    title: 'Algorithm Practice',
    duration: 30,
    content: {
      question: 'Which of these is the best algorithm for getting dressed in the morning?',
      options: [
        'Put on shoes, then socks, then shirt',
        'Put on socks, then shoes, then shirt', 
        'Put on shirt, then socks, then shoes',
        'Put on everything at the same time'
      ],
      correctAnswer: 2,
      explanation: 'Perfect! Just like in programming, the order of steps matters. We need to put on our shirt first, then socks, then shoes - that\'s logical thinking!'
    }
  }
];
