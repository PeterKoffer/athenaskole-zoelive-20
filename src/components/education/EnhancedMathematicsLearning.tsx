
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import { UnifiedLessonProvider } from "./contexts/UnifiedLessonContext";
import EnhancedLessonManager from "./components/EnhancedLessonManager";
import { LessonActivity } from "./components/types/LessonTypes";

// Fixed math activities with consistent structure
const mathActivities: LessonActivity[] = [
  {
    id: 'math-intro-1',
    title: 'Introduction to Algebra',
    type: 'introduction',
    phase: 'introduction',
    duration: 300,
    phaseDescription: 'Welcome introduction to algebra concepts',
    content: {
      hook: 'Welcome to today\'s algebra lesson! We\'ll explore variables and expressions together.'
    }
  },
  {
    id: 'math-practice-1',
    title: 'Solving Simple Equations',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 600,
    phaseDescription: 'Interactive practice with simple equations',
    content: {
      question: 'Solve for x: 2x + 5 = 13',
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
      correctAnswer: 0,
      explanation: 'To solve 2x + 5 = 13, first subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
    }
  },
  {
    id: 'math-practice-2',
    title: 'Variable Substitution',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 600,
    phaseDescription: 'Practice with variable substitution',
    content: {
      question: 'If x = 3, what is 4x - 7?',
      options: ['5', '7', '12', '19'],
      correctAnswer: 0,
      explanation: 'Substitute x = 3 into 4x - 7: 4(3) - 7 = 12 - 7 = 5'
    }
  },
  {
    id: 'math-content-1',
    title: 'Understanding Variables',
    type: 'content-delivery',
    phase: 'content-delivery',
    duration: 400,
    phaseDescription: 'Learn about variables in algebra',
    content: {
      segments: [{
        concept: 'What are Variables?',
        explanation: 'Variables are symbols (usually letters) that represent unknown numbers. In algebra, we use variables like x, y, and z to solve problems.',
        checkQuestion: {
          question: 'Which of the following is a variable?',
          options: ['5', 'x', '10', '+'],
          correctAnswer: 1,
          explanation: 'x is a variable because it represents an unknown value that can change.'
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
          <p className="text-lg">Loading your Mathematics lesson with Nelie...</p>
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
          skillArea="Algebra"
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
