
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const mathematicsLessonConfig: StandardLessonConfig = {
  subject: 'mathematics',
  skillArea: 'Addition and Number Patterns',
  learningObjectives: [
    'Understand addition as combining groups',
    'Recognize and extend number patterns',
    'Apply subtraction as finding differences',
    'Use mental math strategies for efficient calculation',
    'Solve multi-step real-world problems'
  ],
  prerequisites: [
    'Basic counting skills',
    'Understanding of numbers 1-20'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Imagine you're planning the perfect pizza party for your friends! You need to figure out how much pizza to order, how to split the cost fairly, and even how to cut the pizzas into equal slices.",
  realWorldExample: "Every time you go shopping, check your phone battery percentage, or split a bill with friends, you're using the mathematical concepts we'll explore today!",
  thoughtQuestion: "Have you ever wondered why understanding numbers and patterns can actually make your daily life easier and more fun?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
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
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'problem-solving',
  gameInstructions: "You're a Number Detective! Help solve these mathematical mysteries by finding the missing numbers and patterns.",
  gameQuestion: "Detective Challenge: A magical number machine takes any number, adds 7, then subtracts 3. If you put the number 15 into this machine, what number comes out?",
  gameOptions: ["18", "19", "20", "17"],
  gameCorrectAnswer: 1,
  gameExplanation: "Amazing detective work! 15 + 7 = 22, then 22 - 3 = 19. The machine output 19! You cracked the mathematical mystery!",
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "You're organizing a class party! There are 24 students in your class, and you want to arrange them into equal groups for activities.",
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
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "Imagine you could design a new number system for aliens on another planet! How would you explain addition to them?",
  whatIfScenario: "What if we could only use the numbers 1, 2, and 3? How would you represent the number 'seven' using just these three numbers?",
  explorationTask: "Think of three places in your daily life where you use math without even realizing it. How could understanding patterns make these activities more fun or efficient?",
  
  // Phase 6: Summary (1-2 min)
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
    correctAnswer: 1,
    explanation: "Excellent! The mental math strategy of adding 10 and subtracting 1 (28 + 10 - 1 = 37) is much faster than other methods!"
  },
  nextTopicSuggestion: "Next, we'll explore multiplication as repeated addition and discover the amazing patterns in times tables!"
};

export const createMathematicsLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(mathematicsLessonConfig);
  return standardLesson.phases;
};
