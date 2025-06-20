
import { LessonActivity } from '../types/LessonTypes';

export const createMathematicsLesson = (skillArea: string): LessonActivity[] => {
  return [
    {
      id: 'math-welcome',
      type: 'introduction',
      phase: 'introduction',
      title: 'Welcome to Mathematics',
      duration: 120,
      phaseDescription: 'Discovering the power of numbers and patterns!',
      metadata: {
        subject: 'mathematics',
        skillArea: skillArea
      },
      content: {
        hook: 'Ready to explore the fascinating world of mathematics?',
        text: `Today we'll master ${skillArea} and see how math helps us understand the world!`
      }
    },
    
    {
      id: 'math-concept',
      type: 'content-delivery',
      phase: 'content-delivery',
      title: `Mastering ${skillArea}`,
      duration: 300,
      phaseDescription: 'Learning mathematical concepts and problem-solving',
      metadata: {
        subject: 'mathematics',
        skillArea: skillArea
      },
      content: {
        text: `Let's explore the exciting world of ${skillArea}!`,
        segments: [{
          title: `${skillArea} Fundamentals`,
          concept: skillArea,
          explanation: `${skillArea} is an essential mathematical concept that helps us solve problems and understand patterns.`,
          checkQuestion: {
            question: `Why is ${skillArea} important in mathematics?`,
            options: ["Solves problems", "Shows patterns", "Helps in daily life", "All of the above"],
            correctAnswer: 3,
            explanation: "Excellent! Mathematics is everywhere around us!"
          }
        }, {
          title: `${skillArea} Problem Solving`,
          concept: skillArea,
          explanation: `When working with ${skillArea}, we use logical thinking and step-by-step approaches to find solutions.`,
          checkQuestion: {
            question: `What helps us solve ${skillArea} problems?`,
            options: ["Logical thinking", "Step-by-step approach", "Practice", "All of the above"],
            correctAnswer: 3,
            explanation: "Perfect! These strategies make math much easier!"
          }
        }, {
          title: `${skillArea} in Real Life`,
          concept: skillArea,
          explanation: `${skillArea} appears in many real-world situations like cooking, shopping, and building things.`,
          checkQuestion: {
            question: `Where do we use ${skillArea} in real life?`,
            options: ["Cooking recipes", "Shopping and money", "Building projects", "All of the above"],
            correctAnswer: 3,
            explanation: "Great! Math is a practical tool we use every day!"
          }
        }]
      }
    },
    
    {
      id: 'math-summary',
      type: 'summary',
      phase: 'summary',
      title: 'Mathematics Success!',
      duration: 90,
      phaseDescription: 'Celebrating your mathematical achievements',
      metadata: {
        subject: 'mathematics',
        skillArea: skillArea
      },
      content: {
        keyTakeaways: [
          `You mastered ${skillArea}`,
          'You can solve problems step by step',
          'You see math in everyday life!'
        ],
        nextTopicSuggestion: `Ready for more mathematical adventures? Let's explore advanced ${skillArea} concepts!`
      }
    }
  ];
};
