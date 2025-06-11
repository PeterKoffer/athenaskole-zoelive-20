
import { LessonActivity } from '../types/LessonTypes';
import { createStandardLesson, StandardLessonConfig } from '../utils/StandardLessonTemplate';

const computerScienceLessonConfig: StandardLessonConfig = {
  subject: 'computer-science',
  skillArea: 'Computational Thinking and Problem Solving',
  learningObjectives: [
    'Understand programming as giving step-by-step instructions',
    'Recognize algorithms as problem-solving procedures',
    'Apply logical thinking to break down complex problems',
    'Create simple algorithms for everyday tasks',
    'Connect computational thinking to real-world applications'
  ],
  prerequisites: [
    'Basic problem-solving skills',
    'Understanding of sequential steps'
  ],
  
  // Phase 1: Introduction (2-3 min)
  hook: "Every app on your phone, every video game you play, and every website you visit was created by someone who learned to think like a computer scientist - breaking big problems into small, logical steps!",
  realWorldExample: "When you follow a recipe, give directions to a friend, or organize your homework routine, you're already thinking like a programmer - creating step-by-step instructions that others can follow!",
  thoughtQuestion: "What if I told you that learning to 'speak' to computers could help you create anything you can imagine - from games and apps to robots and digital art?",
  
  // Phase 2: Content Delivery (5-7 min, split into segments)
  contentSegments: [
    {
      concept: "Programming: Teaching Computers to Think",
      explanation: "Programming is like giving instructions to a computer! We write step-by-step directions that tell the computer exactly what to do, just like following a recipe. When we program, we become the computer's teacher!",
      checkQuestion: {
        question: "If you want a robot to make a sandwich, what should be the first step?",
        options: ['Eat the sandwich', 'Get the bread', 'Put on the roof', 'Dance'],
        correctAnswer: 1,
        explanation: 'Excellent thinking! Just like in programming, we need to start with the first logical step - getting the bread! Programming is all about thinking step by step.'
      }
    },
    {
      concept: "Algorithms: Recipes for Problem Solving",
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
    },
    {
      concept: "Debugging: Finding and Fixing Problems",
      explanation: "Even the best programmers make mistakes! Debugging is like being a detective - we look for errors in our code and fix them. It's one of the most important skills in computer science because it teaches us to think critically and solve problems!",
      checkQuestion: {
        question: "Your robot follows these steps to make toast: 1) Put bread in toaster, 2) Turn on toaster, 3) Wait, 4) Eat toast. What's wrong?",
        options: ['Nothing is wrong', 'Missing step: Take toast out of toaster', 'Should eat before waiting', 'Should turn on toaster first'],
        correctAnswer: 1,
        explanation: 'Great debugging! We forgot to tell the robot to take the toast out of the toaster before eating it. Good programmers always check their algorithms!'
      }
    }
  ],
  
  // Phase 3: Interactive Game (4-5 min)
  gameType: 'problem-solving',
  gameInstructions: "You're an Algorithm Detective! Help solve these computational thinking puzzles by breaking them down into logical steps.",
  gameQuestion: "A robot needs to sort colored blocks by height and then by color. You have: Red 5cm, Blue 8cm, Red 3cm, Blue 6cm. What's the best step-by-step approach?",
  gameOptions: [
    "Sort by color first, then height within each color",
    "Sort by height first, then color within each height",
    "Mix them randomly",
    "Only sort by color"
  ],
  gameCorrectAnswer: 0,
  gameExplanation: "Excellent algorithm design! Sorting by color first (Red blocks together, Blue blocks together), then by height within each color group is a clear, systematic approach!",
  
  // Phase 4: Application (3-4 min)
  applicationScenario: "You want to create a simple game where players guess a secret number between 1 and 100. You need to design an algorithm that helps players find the answer efficiently.",
  problemSteps: [
    {
      step: "Design the basic game flow: How should the game start and what information does the player need?",
      hint: "Think about what a player needs to know to start playing",
      solution: "Tell the player the range (1-100), ask for their first guess, and explain they'll get 'higher' or 'lower' hints after each guess"
    },
    {
      step: "Create the feedback system: What should happen after each guess?",
      hint: "How can you help the player get closer to the answer?",
      solution: "Compare the guess to the secret number and respond with 'too high,' 'too low,' or 'correct!' plus the number of guesses taken"
    },
    {
      step: "Optimize the strategy: What's the best guessing strategy for players?",
      hint: "Think about how to eliminate the most possibilities with each guess",
      solution: "Use binary search: start with 50, then go to 25 or 75 based on feedback, always picking the middle of the remaining range"
    }
  ],
  
  // Phase 5: Creative Exploration (2-3 min)
  creativePrompt: "If you could program a robot pet, what three special abilities would you give it, and how would you write the algorithms for those abilities?",
  whatIfScenario: "What if computers could understand human emotions as easily as they understand numbers? How would this change the way we create programs and apps?",
  explorationTask: "Look around your home and identify three devices that use computer programming. How do you think the programmers designed the algorithms that make these devices work?",
  
  // Phase 6: Summary (1-2 min)
  keyTakeaways: [
    "Programming is giving step-by-step instructions to computers",
    "Algorithms are like recipes for solving problems",
    "Debugging helps us find and fix errors in our thinking",
    "Computational thinking breaks big problems into smaller steps",
    "Computer science connects to creativity and real-world problem solving"
  ],
  selfAssessment: {
    question: "What's the most important skill for a good programmer?",
    options: [
      "Memorizing lots of code",
      "Typing very fast",
      "Breaking problems into logical, step-by-step solutions",
      "Using the most complicated words possible"
    ],
    correctAnswer: 2,
    explanation: "Perfect! The most important programming skill is computational thinking - breaking complex problems into clear, logical steps that can be solved systematically!"
  },
  nextTopicSuggestion: "Next, we'll explore how to create simple animations and interactive stories using visual programming tools!"
};

export const createComputerScienceLesson = (): LessonActivity[] => {
  const standardLesson = createStandardLesson(computerScienceLessonConfig);
  return standardLesson.phases;
};
