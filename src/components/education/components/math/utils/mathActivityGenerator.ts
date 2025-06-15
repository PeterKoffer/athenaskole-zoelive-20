
import { InteractiveActivity } from '../../../templates/InteractiveLessonTemplate';

export const generateMathActivities = async (): Promise<InteractiveActivity[]> => {
  console.log('🔢 Generating optimized interactive math activities');
  
  // Return interactive activities instead of the old format
  const activities: InteractiveActivity[] = [
    {
      id: 'mental-math-strategies',
      type: 'exploration',
      title: 'Mental Math Strategies',
      description: 'Discover powerful mental math techniques that make calculations faster and easier!',
      duration: 180,
      difficulty: 2,
      points: 20,
      instructions: 'Explore different mental math strategies like number bonds, compensation, and benchmark numbers.',
      successCriteria: 'Learn at least 3 different mental math strategies',
      content: {
        explorationTask: 'Interactive exploration of mental math strategies with visual examples and practice opportunities',
        strategies: [
          {
            name: 'Number Bonds',
            description: 'Break numbers into friendly parts that are easier to work with',
            example: '8 + 7 = 8 + 2 + 5 = 10 + 5 = 15'
          },
          {
            name: 'Compensation',
            description: 'Adjust one number to make calculation easier, then compensate',
            example: '29 + 15 = 30 + 15 - 1 = 45 - 1 = 44'
          },
          {
            name: 'Doubling and Halving',
            description: 'Use known doubles to solve multiplication',
            example: '6 × 8 = (6 × 4) × 2 = 24 × 2 = 48'
          }
        ]
      }
    },
    
    {
      id: 'number-bonds-game',
      type: 'mini-game',
      title: 'Number Bonds Race',
      description: 'Practice number bonds with this fast-paced matching game!',
      duration: 120,
      difficulty: 2,
      points: 15,
      instructions: 'Match number bonds as quickly as possible to score points!',
      successCriteria: 'Complete 10 number bond matches correctly',
      content: {
        gameDescription: 'Drag and drop numbers to create bonds that add up to target numbers',
        targetNumbers: [10, 20, 100],
        timeLimit: 120
      }
    },
    
    {
      id: 'compensation-challenge',
      type: 'quiz',
      title: 'Compensation Strategy Quiz',
      description: 'Test your understanding of the compensation strategy',
      duration: 180,
      difficulty: 3,
      points: 25,
      instructions: 'Solve problems using the compensation strategy and choose the correct answer',
      successCriteria: 'Answer at least 4 out of 5 questions correctly',
      content: {
        question: 'What is 29 + 15 using compensation strategy?',
        options: ['42', '43', '44', '45'],
        correctAnswer: 2,
        explanation: 'Using compensation: 29 + 15 = 30 + 15 - 1 = 45 - 1 = 44',
        additionalQuestions: [
          {
            question: 'What is 98 + 47 using benchmark numbers?',
            options: ['143', '144', '145', '146'],
            correctAnswer: 2,
            explanation: 'Using benchmark numbers: 98 + 47 = 100 + 47 - 2 = 147 - 2 = 145'
          }
        ]
      }
    },
    
    {
      id: 'mental-math-puzzle',
      type: 'puzzle',
      title: 'Mental Math Puzzle Challenge',
      description: 'Solve complex puzzles using your mental math strategies!',
      duration: 240,
      difficulty: 4,
      points: 30,
      instructions: 'Use mental math strategies to solve these challenging puzzles',
      successCriteria: 'Complete 3 different puzzle types',
      content: {
        puzzleDescription: 'Multi-step puzzles that require combining different mental math strategies',
        puzzles: [
          {
            type: 'pattern',
            description: 'Find the pattern in this sequence: 5, 8, 13, 20, 29, ?',
            answer: 40,
            hint: 'Look at the differences between consecutive numbers'
          },
          {
            type: 'magic-square',
            description: 'Complete this 3x3 magic square where each row, column, and diagonal adds to 15',
            grid: [[2, null, 6], [null, 5, null], [4, null, 8]],
            solution: [[2, 7, 6], [9, 5, 1], [4, 3, 8]]
          }
        ]
      }
    },
    
    {
      id: 'real-world-application',
      type: 'simulation',
      title: 'Mental Math Shopping Spree',
      description: 'Use mental math skills in a realistic shopping scenario!',
      duration: 300,
      difficulty: 3,
      points: 35,
      instructions: 'Calculate totals, discounts, and change using mental math strategies',
      successCriteria: 'Successfully complete 5 shopping transactions',
      content: {
        simulationDescription: 'Interactive shopping game where students calculate prices, apply discounts, and make change using mental math',
        scenarios: [
          {
            items: ['Apple $1.25', 'Banana $0.75', 'Orange $1.50'],
            discount: '10% off',
            payment: '$5.00'
          }
        ]
      }
    },
    
    {
      id: 'strategy-creator',
      type: 'creative',
      title: 'Create Your Own Strategy',
      description: 'Invent and demonstrate your own mental math strategy!',
      duration: 360,
      difficulty: 4,
      points: 40,
      instructions: 'Create a new mental math strategy and teach it to others!',
      successCriteria: 'Create an original strategy with clear explanation and examples',
      content: {
        creativePrompt: 'Think of a unique way to solve math problems mentally. Create examples, name your strategy, and make a mini-lesson to teach others!'
      }
    }
  ];

  console.log('✅ Generated', activities.length, 'interactive math activities');
  return activities;
};
