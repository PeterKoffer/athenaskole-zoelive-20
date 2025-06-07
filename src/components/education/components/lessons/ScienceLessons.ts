
import { LessonActivity } from '../types/LessonTypes';

export const createScienceLesson = (): LessonActivity[] => [
  {
    id: 'science-introduction',
    type: 'introduction',
    phase: 'introduction', 
    title: 'Welcome to Scientific Discovery',
    duration: 150,
    phaseDescription: 'Explore the wonders of the natural world',
    content: {
      hook: "Science is all around us! From the air we breathe to the stars in the sky, everything follows amazing patterns and rules that we can discover and understand through observation and experimentation.",
      realWorldExample: "Every time you wonder why the sky is blue, how plants grow, or what makes your heart beat, you're thinking like a scientist - asking questions about the incredible world around us!",
      thoughtQuestion: "What if I told you that understanding science could help you solve everyday mysteries and maybe even make discoveries that could change the world?"
    }
  },
  {
    id: 'science-content-delivery-1',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Animal Habitats and Plant Needs',
    duration: 180,
    phaseDescription: 'Learn about living things and their environments',
    content: {
      segments: [
        {
          concept: "Animal Habitats",
          explanation: "A habitat is where an animal lives and finds everything it needs - food, water, shelter, and space. Different animals need different types of homes! Think of it like your bedroom - you have everything you need there!",
          checkQuestion: {
            question: "Where would you most likely find a polar bear living?",
            options: ['Hot desert', 'Arctic ice and snow', 'Tropical rainforest', 'Deep ocean'],
            correctAnswer: 1,
            explanation: 'Fantastic! Polar bears live in the Arctic where there is lots of ice and snow. Their thick fur keeps them warm in the freezing cold!'
          }
        }
      ]
    }
  },
  {
    id: 'science-interactive-game-1',
    type: 'interactive-game', 
    phase: 'interactive-game',
    title: 'Animal Habitat Match',
    duration: 210,
    phaseDescription: 'Interactive habitat matching game',
    content: {
      gameType: 'matching',
      gameInstructions: "You're a Wildlife Explorer! Help match each animal to its perfect habitat.",
      question: 'Match the animal to its habitat! Which animal lives in the ocean?',
      options: ['Lion', 'Dolphin', 'Eagle', 'Rabbit'],
      correctAnswer: 1,
      explanation: 'Great job! Dolphins live in the ocean and are amazing swimmers. They can hold their breath for a long time underwater!'
    }
  },
  {
    id: 'science-content-delivery-2',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Weather and the Water Cycle',
    duration: 240,
    phaseDescription: 'Discover how weather patterns work',
    content: {
      segments: [
        {
          concept: "What Plants Need",
          explanation: "Plants are living things just like us! They need four important things to grow: sunlight for energy, water to drink, air to breathe, and nutrients from soil to stay healthy. Just like you need food, water, and air!",
          checkQuestion: {
            question: "What do plants need to grow healthy and strong?",
            options: ['Only water', 'Only sunlight', 'Sunlight, water, air, and nutrients', 'Only soil'],
            correctAnswer: 2,
            explanation: 'Perfect! Plants need sunlight, water, air, and nutrients from soil - just like how you need food, water, and air to grow big and strong!'
          }
        },
        {
          concept: "The Water Cycle",
          explanation: "Water goes on an amazing journey! The sun heats up water in oceans and lakes, turning it into invisible water vapor that rises up. When it gets high and cold, it turns back into water droplets that make clouds. Then it falls as rain and starts the journey all over again!",
          checkQuestion: {
            question: "What happens when the sun heats up water in the ocean?",
            options: ['It turns to ice', 'It becomes water vapor and rises up', 'It stays the same', 'It becomes heavier'],
            correctAnswer: 1,
            explanation: 'Amazing! When the sun heats water, it evaporates and becomes invisible water vapor that floats up into the sky. This is how clouds are made!'
          }
        }
      ]
    }
  }
];
