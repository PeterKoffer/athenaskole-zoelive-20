
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import { UnifiedLessonProvider } from "./contexts/UnifiedLessonContext";
import EnhancedLessonManager from "./components/EnhancedLessonManager";
import { LessonActivity } from "./components/types/LessonTypes";

// Comprehensive math activities with all lesson phases restored
const mathActivities: LessonActivity[] = [
  {
    id: 'math-intro-1',
    title: 'Welcome to Algebra Adventures!',
    type: 'introduction',
    phase: 'introduction',
    duration: 180,
    phaseDescription: 'Welcome introduction to algebra concepts',
    content: {
      hook: 'Welcome to an amazing algebra adventure! Today we\'ll discover the magic of variables, solve exciting equations, and become mathematical detectives. Are you ready to unlock the secrets of algebra?'
    }
  },
  {
    id: 'math-content-1',
    title: 'What Are Variables?',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 300,
    phaseDescription: 'Understanding variables in algebra',
    content: {
      segments: [{
        concept: 'Introduction to Variables',
        explanation: 'Variables are like mystery boxes in mathematics! They are letters (like x, y, or z) that represent unknown numbers. Think of them as placeholders waiting to be solved. For example, if x = 5, then x + 3 = 8!',
        checkQuestion: {
          question: 'If a variable represents an unknown number, which of these is a variable?',
          options: ['7', 'x', '15', '+'],
          correctAnswer: 1,
          explanation: 'Correct! The letter \'x\' is a variable because it represents an unknown value that we need to find.'
        }
      }]
    }
  },
  {
    id: 'math-content-2',
    title: 'Understanding Expressions',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 350,
    phaseDescription: 'Learning about algebraic expressions',
    content: {
      segments: [{
        concept: 'Algebraic Expressions',
        explanation: 'An algebraic expression is like a mathematical sentence with variables and numbers. For example, 2x + 5 means "two times some number, plus five." We can substitute different values for x to see what the expression equals!',
        checkQuestion: {
          question: 'In the expression 3y + 7, what does the "3y" mean?',
          options: ['3 plus y', '3 times y', '3 divided by y', '3 minus y'],
          correctAnswer: 1,
          explanation: 'Excellent! When a number is written next to a variable like 3y, it means multiplication: 3 times y.'
        }
      }]
    }
  },
  {
    id: 'math-practice-1',
    title: 'Solving Simple Equations',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 400,
    phaseDescription: 'Practice solving basic equations',
    content: {
      question: 'Let\'s solve our first equation! If 2x + 4 = 12, what is the value of x?',
      options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
      correctAnswer: 1,
      explanation: 'Perfect! To solve 2x + 4 = 12: First subtract 4 from both sides: 2x = 8. Then divide both sides by 2: x = 4. Great job!'
    }
  },
  {
    id: 'math-practice-2',
    title: 'Variable Substitution Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 350,
    phaseDescription: 'Practice substituting values into expressions',
    content: {
      question: 'If y = 6, what is the value of 3y - 8?',
      options: ['10', '12', '14', '16'],
      correctAnswer: 0,
      explanation: 'Wonderful! Substitute y = 6 into 3y - 8: 3(6) - 8 = 18 - 8 = 10. You\'re becoming an algebra expert!'
    }
  },
  {
    id: 'math-practice-3',
    title: 'Equation Detective Work',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 400,
    phaseDescription: 'More challenging equation solving',
    content: {
      question: 'Detective challenge! If x + 7 = 15, what mysterious value is x hiding?',
      options: ['x = 6', 'x = 7', 'x = 8', 'x = 9'],
      correctAnswer: 2,
      explanation: 'Amazing detective work! To find x in x + 7 = 15, subtract 7 from both sides: x = 15 - 7 = 8. Mystery solved!'
    }
  },
  {
    id: 'math-content-3',
    title: 'Real-World Applications',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 380,
    phaseDescription: 'How algebra applies to everyday life',
    content: {
      segments: [{
        concept: 'Algebra in Daily Life',
        explanation: 'Algebra is everywhere! When you calculate how much allowance you\'ll have after buying something, or figure out how many pizza slices each person gets at a party, you\'re using algebra. It helps us solve real problems!',
        checkQuestion: {
          question: 'Sarah has $20 and wants to buy books that cost $3 each. Which equation helps find how many books (b) she can buy?',
          options: ['3 + b = 20', '3b = 20', 'b - 3 = 20', '20 - b = 3'],
          correctAnswer: 1,
          explanation: 'Perfect! Since each book costs $3 and she can buy b books, the total cost is 3b, which must equal her $20: 3b = 20.'
        }
      }]
    }
  },
  {
    id: 'math-practice-4',
    title: 'Word Problem Adventure',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 450,
    phaseDescription: 'Solving real-world word problems',
    content: {
      question: 'Adventure time! Tom collected some stickers. After giving away 5 stickers, he had 12 left. How many stickers did Tom start with?',
      options: ['15 stickers', '17 stickers', '19 stickers', '21 stickers'],
      correctAnswer: 1,
      explanation: 'Excellent problem-solving! If Tom had 12 stickers after giving away 5, then he started with 12 + 5 = 17 stickers. You can also write this as: x - 5 = 12, so x = 17!'
    }
  },
  {
    id: 'math-content-4',
    title: 'Pattern Recognition',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 320,
    phaseDescription: 'Finding patterns in algebraic sequences',
    content: {
      segments: [{
        concept: 'Algebraic Patterns',
        explanation: 'Patterns are the secret language of mathematics! In algebra, we can describe patterns using variables. For example, the pattern 2, 4, 6, 8... can be written as 2n, where n = 1, 2, 3, 4...',
        checkQuestion: {
          question: 'What\'s the next number in this pattern: 5, 10, 15, 20, ?',
          options: ['23', '24', '25', '30'],
          correctAnswer: 2,
          explanation: 'Great pattern recognition! This sequence increases by 5 each time (5×1, 5×2, 5×3, 5×4, 5×5), so the next number is 25!'
        }
      }]
    }
  },
  {
    id: 'math-practice-5',
    title: 'Pattern Equation Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 400,
    phaseDescription: 'Creating equations from patterns',
    content: {
      question: 'Super challenge! If the pattern is 3, 7, 11, 15..., which equation represents the nth term?',
      options: ['n + 3', '3n + 1', '4n - 1', '2n + 5'],
      correctAnswer: 2,
      explanation: 'Incredible work! The pattern increases by 4 each time. When n=1: 4(1)-1=3, n=2: 4(2)-1=7, n=3: 4(3)-1=11. The formula is 4n - 1!'
    }
  },
  {
    id: 'math-content-5',
    title: 'Advanced Problem Solving',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 360,
    phaseDescription: 'Strategic approaches to complex problems',
    content: {
      segments: [{
        concept: 'Problem Solving Strategies',
        explanation: 'Great mathematicians use strategies! When solving algebra problems: 1) Read carefully and identify what you know, 2) Choose a variable for what you don\'t know, 3) Write an equation, 4) Solve step by step, 5) Check your answer!',
        checkQuestion: {
          question: 'What\'s the FIRST step when solving a word problem?',
          options: ['Write an equation', 'Choose a variable', 'Read and understand the problem', 'Start calculating'],
          correctAnswer: 2,
          explanation: 'Absolutely right! Always read and understand the problem first. You need to know what the problem is asking before you can solve it!'
        }
      }]
    }
  },
  {
    id: 'math-practice-6',
    title: 'Multi-Step Challenge',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 500,
    phaseDescription: 'Complex problem with multiple steps',
    content: {
      question: 'Final challenge! A rectangle\'s length is 3 more than twice its width. If the width is 4 units, what\'s the length?',
      options: ['7 units', '9 units', '11 units', '13 units'],
      correctAnswer: 2,
      explanation: 'Outstanding! Length = 3 + 2×width. If width = 4, then length = 3 + 2(4) = 3 + 8 = 11 units. You\'ve mastered multi-step problems!'
    }
  },
  {
    id: 'math-summary',
    title: 'Algebra Mastery Summary',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 240,
    phaseDescription: 'Reviewing key concepts learned',
    content: {
      segments: [{
        concept: 'What We\'ve Learned',
        explanation: 'Congratulations! You\'ve learned that variables are mystery numbers waiting to be solved, expressions combine variables and numbers, equations can be solved step-by-step, and algebra helps us solve real-world problems. You\'re now ready for more advanced mathematical adventures!',
        checkQuestion: {
          question: 'What\'s the most important thing to remember about algebra?',
          options: ['It\'s only about numbers', 'It helps solve real problems', 'It\'s too difficult', 'Variables are scary'],
          correctAnswer: 1,
          explanation: 'Perfect! Algebra is a powerful tool that helps us solve real-world problems and understand patterns in our world. Keep practicing and you\'ll become even better!'
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
          <p className="text-lg">Loading your comprehensive Mathematics lesson with Nelie...</p>
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
          skillArea="Algebra Fundamentals"
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
