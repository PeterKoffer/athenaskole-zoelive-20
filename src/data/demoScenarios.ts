import { ScenarioDefinition } from '@/types/scenario';

export const demoScenarios: ScenarioDefinition[] = [
  {
    id: 'math-fraction-adventure',
    title: 'Fraction Adventure',
    description: 'Help a baker divide pizzas equally among customers while learning fractions',
    educational: {
      subject: 'Mathematics',
      gradeLevel: '3-5',
      learningObjectives: ['Understanding fractions', 'Equal parts', 'Fraction notation']
    },
    initialContext: {
      setting: "Mario's Pizza Shop",
      situation: 'A busy pizza shop needs help dividing pizzas fairly among customers',
      character: 'Mario the Baker'
    },
    entryNodeId: 'welcome',
    nodes: [
      {
        id: 'welcome',
        type: 'narrative',
        content: "Welcome to Mario's Pizza Shop! Today we need your help to serve customers fairly.",
        character: 'Mario',
        backgroundImage: '/pizza-shop.jpg',
        connections: {
          next: 'first-customer'
        }
      },
      {
        id: 'first-customer',
        type: 'question',
        content: 'A family of 4 wants to share 2 pizzas equally. How many pieces should each person get if we cut each pizza into 4 equal slices?',
        question: {
          id: 'q1',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: '1 piece', isCorrect: false },
            { id: 'b', text: '2 pieces', isCorrect: true },
            { id: 'c', text: '3 pieces', isCorrect: false },
            { id: 'd', text: '4 pieces', isCorrect: false }
          ],
          explanation: 'With 2 pizzas cut into 4 slices each (8 total slices) shared among 4 people, each person gets 8 ÷ 4 = 2 pieces!'
        },
        connections: {
          correct: 'end',
          incorrect: 'first-customer'
        }
      },
      {
        id: 'end',
        type: 'narrative',
        content: 'Great job! You helped Mario serve his customers fairly using fractions.',
        character: 'Mario'
      }
    ]
  },
  {
    id: 'science-ecosystem',
    title: 'Ecosystem Explorer',
    description: 'Discover how animals and plants depend on each other in different habitats',
    educational: {
      subject: 'Science',
      gradeLevel: '4-6',
      learningObjectives: ['Food chains', 'Ecosystems', 'Animal habitats']
    },
    initialContext: {
      setting: 'Forest Ecosystem',
      situation: 'Explore how different creatures survive in the forest',
      character: 'Ranger Sarah'
    },
    entryNodeId: 'welcome',
    nodes: [
      {
        id: 'welcome',
        type: 'narrative',
        content: 'Welcome to the forest! I\'m Ranger Sarah, and today we\'ll explore how all living things are connected.',
        character: 'Ranger Sarah',
        connections: {
          next: 'food-chain-question'
        }
      },
      {
        id: 'food-chain-question',
        type: 'question',
        content: 'Look at this food chain: Grass → Rabbit → Fox. What role does the rabbit play?',
        question: {
          id: 'q1',
          type: 'multiple-choice',
          options: [
            { id: 'a', text: 'Producer', isCorrect: false },
            { id: 'b', text: 'Primary Consumer', isCorrect: true },
            { id: 'c', text: 'Secondary Consumer', isCorrect: false },
            { id: 'd', text: 'Decomposer', isCorrect: false }
          ],
          explanation: 'The rabbit is a primary consumer because it eats plants (producers) and is eaten by secondary consumers like the fox.'
        },
        connections: {
          correct: 'end',
          incorrect: 'food-chain-question'
        }
      },
      {
        id: 'end',
        type: 'narrative',
        content: 'Excellent! You understand how energy flows through ecosystems. Every creature has an important role!',
        character: 'Ranger Sarah'
      }
    ]
  }
];