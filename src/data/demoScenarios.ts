
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
    states: [
      {
        id: 'welcome',
        type: 'narrative' as const,
        content: {
          text: "Welcome to Mario's Pizza Shop! Today we need your help to serve customers fairly.",
          character: 'Mario',
          backgroundImage: '/pizza-shop.jpg'
        },
        transitions: [
          {
            id: 'start-serving',
            text: 'Ready to help!',
            targetState: 'first-customer'
          }
        ]
      },
      {
        id: 'first-customer',
        type: 'question' as const,
        content: {
          text: 'A family of 4 wants to share 2 pizzas equally. How many pieces should each person get if we cut each pizza into 4 equal slices?',
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
          }
        },
        transitions: [
          {
            id: 'correct',
            text: 'Next customer',
            targetState: 'end',
            condition: { type: 'answer-correct' }
          },
          {
            id: 'incorrect',
            text: 'Try again',
            targetState: 'first-customer',
            condition: { type: 'answer-incorrect' }
          }
        ]
      },
      {
        id: 'end',
        type: 'narrative' as const,
        content: {
          text: 'Great job! You helped Mario serve his customers fairly using fractions.',
          character: 'Mario'
        },
        transitions: []
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
    states: [
      {
        id: 'welcome',
        type: 'narrative' as const,
        content: {
          text: 'Welcome to the forest! I\'m Ranger Sarah, and today we\'ll explore how all living things are connected.',
          character: 'Ranger Sarah'
        },
        transitions: [
          {
            id: 'start-exploring',
            text: 'Let\'s explore!',
            targetState: 'food-chain-question'
          }
        ]
      },
      {
        id: 'food-chain-question',
        type: 'question' as const,
        content: {
          text: 'Look at this food chain: Grass → Rabbit → Fox. What role does the rabbit play?',
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
          }
        },
        transitions: [
          {
            id: 'correct',
            text: 'Continue exploring',
            targetState: 'end',
            condition: { type: 'answer-correct' }
          },
          {
            id: 'incorrect',
            text: 'Let me think again',
            targetState: 'food-chain-question',
            condition: { type: 'answer-incorrect' }
          }
        ]
      },
      {
        id: 'end',
        type: 'narrative' as const,
        content: {
          text: 'Excellent! You understand how energy flows through ecosystems. Every creature has an important role!',
          character: 'Ranger Sarah'
        },
        transitions: []
      }
    ]
  }
];
