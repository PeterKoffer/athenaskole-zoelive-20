
import { LessonActivity } from '../types/LessonTypes';

export const createComputerScienceLesson = (): LessonActivity[] => [
  {
    id: 'cs-introduction',
    type: 'introduction',
    phase: 'introduction',
    title: 'Welcome to Computer Science Adventures',
    duration: 150,
    phaseDescription: 'Discover the logic and creativity behind technology',
    content: {
      hook: "Every app on your phone, every video game you play, and every website you visit was created by someone who learned to think like a computer scientist - breaking big problems into small, logical steps!",
      realWorldExample: "When you follow a recipe, give directions to a friend, or organize your homework routine, you're already thinking like a programmer - creating step-by-step instructions that others can follow!",
      thoughtQuestion: "What if I told you that learning to 'speak' to computers could help you create anything you can imagine - from games and apps to robots and digital art?"
    }
  },
  {
    id: 'cs-content-delivery',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Programming and Algorithms',
    duration: 240,
    phaseDescription: 'Learn the fundamentals of computational thinking',
    content: {
      segments: [
        {
          concept: "What is Programming?",
          explanation: "Programming is like giving instructions to a computer! We write step-by-step directions that tell the computer exactly what to do, just like following a recipe. When we program, we become the computer's teacher!",
          checkQuestion: {
            question: "If you want a robot to make a sandwich, what should be the first step?",
            options: ['Eat the sandwich', 'Get the bread', 'Put on the roof', 'Dance'],
            correctAnswer: 1,
            explanation: 'Excellent thinking! Just like in programming, we need to start with the first logical step - getting the bread! Programming is all about thinking step by step.'
          }
        },
        {
          concept: "Algorithms Everywhere",
          explanation: "An algorithm is like a recipe or a set of instructions! We use algorithms every day - when we brush our teeth, make breakfast, or even tie our shoes. In computer science, algorithms help us solve problems step by step!",
          checkQuestion: {
            question: "Which of these is the best algorithm for getting dressed in the morning?",
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
      ]
    }
  },
  {
    id: 'cs-interactive-game',
    type: 'interactive-game',
    phase: 'interactive-game',
    title: 'Algorithm Detective Challenge',
    duration: 270,
    phaseDescription: 'Solve computational thinking puzzles',
    content: {
      gameType: 'problem-solving',
      gameInstructions: "You're an Algorithm Detective! Help solve these logical puzzles by thinking step-by-step like a computer programmer.",
      question: "A robot needs to sort books on a shelf from shortest to tallest. The books are: 5cm, 12cm, 8cm, 3cm tall. What should be the final order?",
      options: ["5cm, 12cm, 8cm, 3cm", "3cm, 5cm, 8cm, 12cm", "12cm, 8cm, 5cm, 3cm", "8cm, 3cm, 12cm, 5cm"],
      correctAnswer: 1,
      explanation: "Brilliant detective work! 3cm, 5cm, 8cm, 12cm is the correct order from shortest to tallest. You solved the sorting algorithm perfectly!"
    }
  }
];
