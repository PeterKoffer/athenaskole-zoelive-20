
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import LessonProgressTracker from "./components/LessonProgressTracker";
import LessonControlsCard from "./components/LessonControlsCard";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { UnifiedLessonProvider, useUnifiedLesson } from "./contexts/UnifiedLessonContext";
import { LessonActivity } from "./components/types/LessonTypes";

// Sample activities for mathematics - these would normally come from a curriculum system
const mathActivities: LessonActivity[] = [
  {
    id: 'math-intro-1',
    title: 'Introduction to Algebra',
    phase: 'explanation',
    content: {
      explanation: 'Welcome to today\'s algebra lesson! We\'ll explore variables and expressions.'
    }
  },
  {
    id: 'math-practice-1',
    title: 'Solving Simple Equations',
    phase: 'interactive-game',
    content: {
      question: 'Solve for x: 2x + 5 = 13',
      options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
      correctAnswer: 0
    }
  },
  {
    id: 'math-practice-2',
    title: 'Variable Substitution',
    phase: 'interactive-game',
    content: {
      question: 'If x = 3, what is 4x - 7?',
      options: ['5', '7', '12', '19'],
      correctAnswer: 0
    }
  }
];

const EnhancedMathematicsLearningContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const totalLessonTime = 20 * 60; // 20 minutes in seconds
  
  const {
    phase,
    timeSpent,
    currentSegment,
    totalSegments,
    handleLessonStart,
    handleLessonPause,
    handleLessonResume,
    handleLessonComplete
  } = useUnifiedLesson();

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
        {/* Header with navigation and progress */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToProgram}
            className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          
          {phase !== 'introduction' && (
            <LessonProgressTracker 
              currentTime={timeSpent}
              totalTime={totalLessonTime}
              currentSegment={currentSegment}
              totalSegments={totalSegments}
              phase={phase}
            />
          )}
        </div>

        {/* Lesson Controls */}
        {(phase === 'lesson' || phase === 'paused') && (
          <LessonControlsCard
            phase={phase}
            onPause={handleLessonPause}
            onResume={handleLessonResume}
          />
        )}

        {/* Lesson Content */}
        <LessonPhaseRenderer
          lessonState={{
            phase,
            timeSpent,
            currentSegment,
            totalSegments,
            score: 0 // Will be managed by unified context
          }}
          onLessonStart={handleLessonStart}
          onLessonComplete={handleLessonComplete}
          onLessonResume={handleLessonResume}
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
