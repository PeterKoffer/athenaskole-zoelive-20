
import { LessonActivity } from '../types/LessonTypes';

export const createCreativeArtsLesson = (): LessonActivity[] => [
  {
    id: 'art-introduction',
    type: 'introduction',
    phase: 'introduction',
    title: 'Welcome to Creative Arts Adventures',
    duration: 150,
    phaseDescription: 'Explore the colorful world of artistic expression',
    content: {
      hook: "Art is everywhere! From the colors of a sunset to the design of your favorite app, creative expression surrounds us and helps us communicate ideas that words alone cannot express.",
      realWorldExample: "Every time you choose what to wear, arrange your room, or doodle in your notebook, you're making artistic decisions that reflect your unique creativity!",
      thoughtQuestion: "Have you ever wondered how artists use simple shapes and colors to create masterpieces that can make people feel joy, wonder, or inspiration?"
    }
  },
  {
    id: 'art-content-delivery',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Primary Colors and Shape Foundations',
    duration: 240,
    phaseDescription: 'Learn the building blocks of visual art',
    content: {
      segments: [
        {
          concept: "Primary Colors: The Foundation of All Colors",
          explanation: "Primary colors are red, blue, and yellow! These are special colors because we can mix them together to create all other colors. They are like the building blocks of art - just like how letters make words!",
          checkQuestion: {
            question: "What color do you get when you mix red and yellow?",
            options: ['Purple', 'Orange', 'Green', 'Pink'],
            correctAnswer: 1,
            explanation: 'Wonderful! Red and yellow make orange - just like a beautiful sunset or a pumpkin! Color mixing is like magic in art!'
          }
        },
        {
          concept: "Shapes in Art",
          explanation: "Artists use basic shapes like circles, squares, and triangles to create amazing artwork! Every drawing starts with simple shapes. Even the most complex paintings begin with these basic building blocks!",
          checkQuestion: {
            question: "If you wanted to draw a house, which shapes would you use?",
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
      ]
    }
  },
  {
    id: 'art-interactive-game',
    type: 'interactive-game',
    phase: 'interactive-game',
    title: 'Color Mixing Challenge',
    duration: 210,
    phaseDescription: 'Interactive color theory game',
    content: {
      gameType: 'problem-solving',
      gameInstructions: "You're a Color Wizard! Help mix the perfect colors for different artistic creations.",
      question: "A young artist wants to paint grass for their landscape. Which two primary colors should they mix?",
      options: ["Red and Yellow", "Blue and Yellow", "Red and Blue", "Yellow and Yellow"],
      correctAnswer: 1,
      explanation: "Magical! Blue and Yellow make Green - the perfect color for painting beautiful grass and leaves in nature scenes!"
    }
  }
];
