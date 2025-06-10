
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import LessonProgressTracker from "./components/LessonProgressTracker";
import LessonControlsCard from "./components/LessonControlsCard";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { UnifiedLessonProvider, useUnifiedLesson } from "./contexts/UnifiedLessonContext";
import { LessonActivity } from "./components/types/LessonTypes";

// Sample activities for English - these would normally come from a curriculum system
const englishActivities: LessonActivity[] = [
  {
    id: 'english-intro-1',
    title: 'Introduction to Creative Writing',
    phase: 'explanation',
    content: {
      explanation: 'Welcome to today\'s English lesson! We\'ll explore storytelling and creative writing techniques.'
    }
  },
  {
    id: 'english-practice-1',
    title: 'Identifying Literary Devices',
    phase: 'interactive-game',
    content: {
      question: 'Which literary device is used in: "The wind whispered through the trees"?',
      options: ['Metaphor', 'Personification', 'Simile', 'Alliteration'],
      correctAnswer: 1
    }
  },
  {
    id: 'english-practice-2',
    title: 'Story Structure',
    phase: 'interactive-game',
    content: {
      question: 'What are the three main parts of a story structure?',
      options: ['Beginning, middle, end', 'Setting, character, plot', 'Problem, action, solution', 'Introduction, body, conclusion'],
      correctAnswer: 0
    }
  }
];

const EnglishLearningContent = () => {
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
          <BookOpen className="w-16 h-16 text-lime-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading your English lesson with Nelie...</p>
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
          subject="english"
          skillArea="grade-appropriate"
        />
      </div>
    </div>
  );
};

const EnglishLearning = () => {
  const navigate = useNavigate();
  
  const handleLessonComplete = () => {
    navigate('/daily-program');
  };

  return (
    <UnifiedLessonProvider
      subject="English"
      allActivities={englishActivities}
      onLessonComplete={handleLessonComplete}
    >
      <EnglishLearningContent />
    </UnifiedLessonProvider>
  );
};

export default EnglishLearning;
