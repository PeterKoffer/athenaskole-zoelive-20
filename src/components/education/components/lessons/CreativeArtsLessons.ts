
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const creativeArtsLessonConfig: StandardLessonConfig = {
  subject: 'creative-arts',
  skillArea: 'Visual Arts and Creative Expression',
  learningObjectives: [
    'Understand primary colors as the foundation of all colors',
    'Use basic shapes to create complex artistic compositions',
    'Apply color theory to create mood and emotion in art',
    'Develop observation skills for artistic inspiration',
    'Express personal creativity through visual art techniques'
  ],
  prerequisites: [
    'Basic shape recognition',
    'Fine motor skills for drawing/coloring'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Art is everywhere! From the colors of a sunset to the design of your favorite app, creative expression surrounds us and helps us communicate ideas that words alone cannot express.",
  realWorldExample: "Every time you choose what to wear, arrange your room, or doodle in your notebook, you're making artistic decisions that reflect your unique creativity!",
  thoughtQuestion: "Have you ever wondered how artists use simple shapes and colors to create masterpieces that can make people feel joy, wonder, or inspiration?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
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
      concept: "Shapes: The Building Blocks of Art",
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
    },
    {
      concept: "Colors and Emotions in Art",
      explanation: "Colors can make us feel different emotions! Warm colors like red, orange, and yellow can make us feel excited and happy. Cool colors like blue, green, and purple can make us feel calm and peaceful. Artists use this color psychology to tell stories!",
      checkQuestion: {
        question: "If an artist wants to paint a peaceful ocean scene, which color family would work best?",
        options: ['Warm colors (reds, oranges)', 'Cool colors (blues, greens)', 'Only black and white', 'Bright neon colors'],
        correctAnswer: 1,
        explanation: 'Perfect choice! Cool colors like blues and greens create a peaceful, calming feeling that matches the tranquil mood of an ocean scene!'
      }
    }
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'matching',
  gameInstructions: "You're a Color Wizard! Help create the perfect colors for different artistic projects by mixing primary colors.",
  gameQuestion: "A young artist wants to paint a beautiful purple flower. Which two primary colors should they mix to create purple?",
  gameOptions: ["Red and Yellow", "Blue and Yellow", "Red and Blue", "Yellow and Yellow"],
  gameCorrectAnswer: 2,
  gameExplanation: "Magical! Red and Blue make Purple - a royal color perfect for painting beautiful flowers, grapes, or majestic sunsets!",
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "You're designing a poster for your school's spring festival. The theme is 'New Beginnings and Growth' and you want to use colors and shapes that represent this theme perfectly.",
  problemSteps: [
    {
      step: "Choose colors that represent growth and new beginnings in nature",
      hint: "Think about what colors you see when plants grow in spring",
      solution: "Use greens for growth and fresh life, with yellows for sunshine and energy, plus light blues for clear spring skies"
    },
    {
      step: "Select shapes that symbolize growth and movement",
      hint: "What shapes in nature represent growth upward and outward?",
      solution: "Use triangles pointing upward for growth, circles for flowers and sun, and curved lines for flowing movement and natural forms"
    },
    {
      step: "Arrange your design to guide the viewer's eye and create visual balance",
      hint: "How can you use size and placement to create an appealing composition?",
      solution: "Place the largest element (like the sun) in the upper area, balance with smaller shapes throughout, and create a path for the eye to follow across the poster"
    }
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "If you could paint with sounds instead of colors, what would your favorite song look like as a painting? What shapes and colors would represent different instruments?",
  whatIfScenario: "What if you could only use three colors to create art for the rest of your life? Which three would you choose and why?",
  explorationTask: "Look at the room you're in right now. How would you redesign it using only basic shapes and primary colors to make it feel more energetic or more peaceful?",
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Primary colors (red, blue, yellow) can be mixed to create all other colors",
    "Basic shapes are the building blocks of all artistic compositions",
    "Colors can express emotions and create different moods",
    "Art is everywhere in our daily environment",
    "Everyone can be creative by combining simple elements in unique ways"
  ],
  selfAssessment: {
    question: "What's the most important thing to remember when creating art?",
    options: [
      "You must be perfect the first time",
      "There's only one right way to make art",
      "Express yourself creatively and enjoy the process",
      "Only use expensive art supplies"
    ],
    correctAnswer: 2,
    explanation: "Perfect! Art is about creative expression and enjoying the process of creating. There's no 'wrong' way to be creative - every artist's unique perspective is valuable!"
  },
  nextTopicSuggestion: "Next, we'll explore different art techniques like painting, drawing, and sculpture, and learn how famous artists created their masterpieces!"
};

export const createCreativeArtsLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(creativeArtsLessonConfig);
  return standardLesson.phases;
};
