
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import { UnifiedLessonProvider } from "./contexts/UnifiedLessonContext";
import EnhancedLessonManager from "./components/EnhancedLessonManager";
import { LessonActivity } from "./components/types/LessonTypes";

// Diverse math activities with proper timing (total ~20 minutes = 1200 seconds)
const mathActivities: LessonActivity[] = [
  {
    id: 'math-intro-1',
    title: 'Welcome to Math Adventures!',
    type: 'introduction',
    phase: 'introduction',
    duration: 60, // 1 minute
    phaseDescription: 'Welcome introduction to math concepts',
    content: {
      hook: 'Welcome to an amazing math adventure! Today we\'ll explore numbers, shapes, patterns, and solve exciting problems. Get ready to become a math detective!'
    }
  },
  
  // COUNTING & BASIC OPERATIONS (3 minutes)
  {
    id: 'math-counting-1',
    title: 'Counting Fun with Animals',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Count objects and learn basic numbers',
    content: {
      question: 'Count the animals: 🐶🐶🐶🐱🐱 How many pets are there in total?',
      options: ['5 pets', '4 pets', '6 pets', '3 pets'],
      correctAnswer: 0,
      explanation: 'Great counting! There are 3 dogs + 2 cats = 5 pets total!'
    }
  },
  {
    id: 'math-addition-1',
    title: 'Pizza Party Addition',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Basic addition with real-world context',
    content: {
      question: 'At the pizza party, there are 4 cheese pizzas and 3 pepperoni pizzas. How many pizzas in total?',
      options: ['6 pizzas', '7 pizzas', '8 pizzas', '5 pizzas'],
      correctAnswer: 1,
      explanation: 'Perfect! 4 + 3 = 7 pizzas. Everyone will have plenty to eat!'
    }
  },

  // SHAPES & GEOMETRY (3 minutes)
  {
    id: 'math-shapes-intro',
    title: 'Exploring Shapes Around Us',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Learning about basic geometric shapes',
    content: {
      segments: [{
        concept: 'Basic Shapes',
        explanation: 'Shapes are everywhere! A circle is round like a ball, a square has 4 equal sides like a window, and a triangle has 3 sides like a slice of pizza. Can you find shapes around your room?',
        checkQuestion: {
          question: 'Which shape has 3 sides?',
          options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
          correctAnswer: 2,
          explanation: 'Excellent! A triangle has exactly 3 sides and 3 corners.'
        }
      }]
    }
  },
  {
    id: 'math-shapes-game',
    title: 'Shape Detective Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Identify shapes in everyday objects',
    content: {
      question: 'A clock face is what shape?',
      options: ['Triangle', 'Square', 'Circle', 'Rectangle'],
      correctAnswer: 2,
      explanation: 'Correct! Clock faces are circles because they are perfectly round.'
    }
  },

  // PATTERNS & SEQUENCES (3 minutes)
  {
    id: 'math-patterns-1',
    title: 'Number Pattern Detective',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Finding patterns in number sequences',
    content: {
      question: 'What comes next in this pattern? 2, 4, 6, 8, ?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Amazing! The pattern adds 2 each time: 2, 4, 6, 8, 10. These are called even numbers!'
    }
  },
  {
    id: 'math-patterns-2',
    title: 'Color Pattern Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Recognizing visual patterns',
    content: {
      question: 'Complete the pattern: Red, Blue, Red, Blue, Red, ?',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: 1,
      explanation: 'Perfect pattern recognition! The colors alternate: Red, Blue, Red, Blue, so Blue comes next!'
    }
  },

  // MEASUREMENT & TIME (3 minutes)
  {
    id: 'math-measurement-1',
    title: 'Measuring with Fun',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Understanding measurement concepts',
    content: {
      segments: [{
        concept: 'Big and Small, Long and Short',
        explanation: 'We can measure how long, how tall, and how heavy things are! A pencil is shorter than a ruler. An elephant is heavier than a mouse. We use words like bigger, smaller, longer, and shorter to compare!',
        checkQuestion: {
          question: 'Which is longer?',
          options: ['A paperclip', 'A school bus', 'A penny', 'A button'],
          correctAnswer: 1,
          explanation: 'Great thinking! A school bus is much longer than all the other objects!'
        }
      }]
    }
  },
  {
    id: 'math-time-1',
    title: 'Time Adventure',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Learning to tell time',
    content: {
      question: 'How many minutes are in one hour?',
      options: ['30 minutes', '45 minutes', '60 minutes', '90 minutes'],
      correctAnswer: 2,
      explanation: 'Fantastic! There are 60 minutes in 1 hour. That\'s like 60 seconds in 1 minute!'
    }
  },

  // MONEY & REAL-WORLD MATH (3 minutes)
  {
    id: 'math-money-1',
    title: 'Counting Coins',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Learning about money and counting coins',
    content: {
      question: 'If you have 2 quarters (25¢ each), how much money do you have?',
      options: ['25¢', '40¢', '50¢', '75¢'],
      correctAnswer: 2,
      explanation: 'Excellent money math! 25¢ + 25¢ = 50¢. Two quarters make half a dollar!'
    }
  },
  {
    id: 'math-shopping-1',
    title: 'Store Shopping Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Real-world problem solving with money',
    content: {
      question: 'You want to buy a toy for $3 and a book for $2. How much do you need in total?',
      options: ['$4', '$5', '$6', '$7'],
      correctAnswer: 1,
      explanation: 'Perfect shopping math! $3 + $2 = $5 total. You\'re ready to go shopping!'
    }
  },

  // SUBTRACTION & PROBLEM SOLVING (3 minutes)
  {
    id: 'math-subtraction-1',
    title: 'Cookie Subtraction Story',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Learning subtraction through stories',
    content: {
      question: 'Mom baked 10 cookies. The family ate 3 cookies. How many cookies are left?',
      options: ['6 cookies', '7 cookies', '8 cookies', '9 cookies'],
      correctAnswer: 1,
      explanation: 'Great subtraction! 10 - 3 = 7 cookies left. Yummy cookies for later!'
    }
  },
  {
    id: 'math-problem-solving-1',
    title: 'Math Detective Mystery',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 90, // 1.5 minutes
    phaseDescription: 'Multi-step problem solving',
    content: {
      question: 'There are 12 birds in a tree. 4 birds fly away, then 2 more birds come. How many birds are in the tree now?',
      options: ['8 birds', '9 birds', '10 birds', '11 birds'],
      correctAnswer: 2,
      explanation: 'Amazing detective work! 12 - 4 = 8, then 8 + 2 = 10 birds. You solved the mystery!'
    }
  },

  // MULTIPLICATION INTRO (2 minutes)
  {
    id: 'math-multiplication-1',
    title: 'Groups and Multiplication Magic',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 120, // 2 minutes
    phaseDescription: 'Introduction to multiplication concepts',
    content: {
      segments: [{
        concept: 'Making Groups',
        explanation: 'Multiplication is like making equal groups! If you have 3 bags with 2 apples each, that\'s 3 × 2 = 6 apples total. It\'s faster than counting 2 + 2 + 2!',
        checkQuestion: {
          question: 'If you have 4 boxes with 3 toys each, how many toys in total?',
          options: ['7 toys', '10 toys', '12 toys', '15 toys'],
          correctAnswer: 2,
          explanation: 'Wonderful! 4 × 3 = 12 toys. You have 4 groups of 3 toys each!'
        }
      }]
    }
  },

  // SUMMARY & CELEBRATION (1 minute)
  {
    id: 'math-summary',
    title: 'Math Adventure Complete!',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 60, // 1 minute
    phaseDescription: 'Celebrating math learning achievements',
    content: {
      segments: [{
        concept: 'You\'re a Math Star!',
        explanation: 'Congratulations! You\'ve learned about counting, shapes, patterns, time, money, and problem-solving. Math is everywhere around us, and you\'re becoming a real math detective! Keep practicing and exploring numbers!',
        checkQuestion: {
          question: 'What\'s your favorite thing about math?',
          options: ['Solving problems', 'Finding patterns', 'Counting things', 'All of the above!'],
          correctAnswer: 3,
          explanation: 'Perfect answer! Math has so many exciting parts, and you can enjoy them all!'
        }
      }]
    }
  }
];

const EnhancedMathematicsLearningContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-lime-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading your diverse Mathematics lesson with Nelie...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <EnhancedLessonManager
          subject="Mathematics"
          skillArea="Mixed Math Skills"
          onBackToProgram={handleBackToProgram}
        />
      </div>
    </div>
  );
};

const EnhancedMathematicsLearning = () => {
  const navigate = useNavigate();
  
  const handleLessonComplete = () => {
    navigate('/daily-program');
  };

  return (
    <UnifiedLessonProvider
      subject="Mathematics"
      allActivities={mathActivities}
      onLessonComplete={handleLessonComplete}
    >
      <EnhancedMathematicsLearningContent />
    </UnifiedLessonProvider>
  );
};

export default EnhancedMathematicsLearning;
