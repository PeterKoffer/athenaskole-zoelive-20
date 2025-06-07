
import { LessonActivity } from '../types/LessonTypes';

export const createMathematicsLesson = (): LessonActivity[] => [
  {
    id: 'math-introduction',
    type: 'introduction',
    phase: 'introduction',
    title: 'Welcome to Mathematical Problem Solving',
    duration: 150, // 2.5 minutes
    phaseDescription: 'Engaging hook with real-world connection',
    content: {
      hook: "Imagine you're planning the perfect pizza party for your friends! You need to figure out how much pizza to order, how to split the cost fairly, and even how to cut the pizzas into equal slices.",
      realWorldExample: "Every time you go shopping, check your phone battery percentage, or split a bill with friends, you're using the mathematical concepts we'll explore today!",
      thoughtQuestion: "Have you ever wondered why understanding numbers and patterns can actually make your daily life easier and more fun?"
    }
  },
  
  {
    id: 'math-content-1',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Understanding Addition and Number Relationships',
    duration: 180, // 3 minutes
    phaseDescription: 'Core concepts with integrated comprehension checks',
    content: {
      segments: [
        {
          concept: "Addition as Combining Groups",
          explanation: "Addition is like bringing groups together to see how many we have in total. When we add 4 + 3, we're combining a group of 4 with a group of 3 to get 7 total items.",
          checkQuestion: {
            question: "If you have 5 red marbles and your friend gives you 3 blue marbles, how many marbles do you have altogether?",
            options: ["7 marbles", "8 marbles", "9 marbles", "6 marbles"],
            correctAnswer: 1,
            explanation: "Great! 5 + 3 = 8 marbles total. You combined your group of 5 with the group of 3!"
          }
        },
        {
          concept: "Number Patterns and Sequences",
          explanation: "Numbers follow amazing patterns! When we count by 2s (2, 4, 6, 8...), we're seeing a pattern where each number is 2 more than the previous one.",
          checkQuestion: {
            question: "What comes next in this pattern: 10, 12, 14, 16, ?",
            options: ["17", "18", "19", "20"],
            correctAnswer: 1,
            explanation: "Perfect! The pattern adds 2 each time, so 16 + 2 = 18!"
          }
        }
      ]
    }
  },
  
  {
    id: 'math-content-2',
    type: 'content-delivery',
    phase: 'content-delivery',
    title: 'Exploring Subtraction and Problem-Solving Strategies',
    duration: 240, // 4 minutes
    phaseDescription: 'Advanced concepts with active learning checks',
    content: {
      segments: [
        {
          concept: "Subtraction as Finding the Difference",
          explanation: "Subtraction helps us find out how many are left or what the difference is between two amounts. It's like taking items away from a group or comparing two groups.",
          checkQuestion: {
            question: "Maya had 12 stickers and gave 4 to her brother. How many stickers does Maya have left?",
            options: ["8 stickers", "9 stickers", "7 stickers", "6 stickers"],
            correctAnswer: 0,
            explanation: "Excellent! 12 - 4 = 8 stickers. Maya started with 12 and gave away 4, leaving her with 8!"
          }
        },
        {
          concept: "Mental Math Strategies",
          explanation: "Smart mathematicians use tricks! To add 9 to any number, you can add 10 and then subtract 1. For example: 25 + 9 = (25 + 10) - 1 = 35 - 1 = 34!",
          checkQuestion: {
            question: "Using the mental math trick, what is 37 + 9?",
            options: ["45", "46", "47", "44"],
            correctAnswer: 1,
            explanation: "Brilliant! 37 + 10 = 47, then 47 - 1 = 46. You used the mental math strategy perfectly!"
          }
        }
      ]
    }
  },

  {
    id: 'math-game-activity',
    type: 'interactive-game',
    phase: 'interactive-game',
    title: 'Number Detective Challenge',
    duration: 270, // 4.5 minutes
    phaseDescription: 'Fun problem-solving game with immediate feedback',
    content: {
      gameType: 'problem-solving',
      gameInstructions: "You're a Number Detective! Help solve these mathematical mysteries by finding the missing numbers and patterns.",
      question: "Detective Challenge: A magical number machine takes any number, adds 7, then subtracts 3. If you put the number 15 into this machine, what number comes out?",
      options: ["18", "19", "20", "17"],
      correctAnswer: 1,
      explanation: "Amazing detective work! 15 + 7 = 22, then 22 - 3 = 19. The machine output 19! You cracked the mathematical mystery!"
    }
  },

  {
    id: 'math-application',
    type: 'application',
    phase: 'application',
    title: 'Real-World Math Problem Solving',
    duration: 210, // 3.5 minutes
    phaseDescription: 'Apply concepts to authentic scenarios',
    content: {
      scenario: "You're organizing a class party! There are 24 students in your class, and you want to arrange them into equal groups for activities.",
      problemSteps: [
        {
          step: "If you make groups of 4 students each, how many groups will you have?",
          hint: "Think about how many times 4 goes into 24",
          solution: "24 ÷ 4 = 6 groups of 4 students each"
        },
        {
          step: "Each group needs 3 balloons for their activity. How many balloons do you need total?",
          hint: "Multiply the number of groups by balloons per group",
          solution: "6 groups × 3 balloons = 18 balloons total"
        },
        {
          step: "Balloons come in packs of 5. How many packs do you need to buy?",
          hint: "You need 18 balloons, and each pack has 5",
          solution: "18 ÷ 5 = 3.6, so you need 4 packs (always round up for purchases!)"
        }
      ]
    }
  },

  {
    id: 'math-creative-exploration',
    type: 'creative-exploration',
    phase: 'creative-exploration',
    title: 'Mathematical Creativity and Innovation',
    duration: 150, // 2.5 minutes
    phaseDescription: 'Encourage creative mathematical thinking',
    content: {
      creativePrompt: "Imagine you could design a new number system for aliens on another planet! How would you explain addition to them?",
      whatIfScenario: "What if we could only use the numbers 1, 2, and 3? How would you represent the number 'seven' using just these three numbers?",
      explorationTask: "Think of three places in your daily life where you use math without even realizing it. How could understanding patterns make these activities more fun or efficient?"
    }
  },

  {
    id: 'math-summary',
    type: 'summary',
    phase: 'summary',
    title: 'Mathematical Mastery Summary',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Consolidate learning and plan next steps',
    content: {
      keyTakeaways: [
        "Addition combines groups to find totals",
        "Subtraction finds differences or what's left",
        "Patterns help us predict and understand numbers",
        "Mental math strategies make calculations faster",
        "Math exists everywhere in our daily lives"
      ],
      selfAssessment: {
        question: "Which strategy would be most helpful for quickly calculating 28 + 9?",
        options: [
          "Count on my fingers 9 times",
          "Add 10, then subtract 1",
          "Use a calculator",
          "Draw 28 circles and 9 more circles"
        ],
        correctAnswer: 1
      },
      nextTopicSuggestion: "Next, we'll explore multiplication as repeated addition and discover the amazing patterns in times tables!"
    }
  }
];
