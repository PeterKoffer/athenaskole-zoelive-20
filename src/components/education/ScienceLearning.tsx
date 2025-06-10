
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { UnifiedLessonProvider, useUnifiedLesson } from "./contexts/UnifiedLessonContext";
import { LessonActivity } from "./components/types/LessonTypes";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

// Sample activities for Science - these would normally come from a curriculum system
const scienceActivities: LessonActivity[] = [
  {
    id: 'science-intro-1',
    title: 'Introduction to the Solar System',
    phase: 'explanation',
    content: {
      explanation: 'Welcome to today\'s science lesson! We\'ll explore our solar system and the planets within it.'
    }
  },
  {
    id: 'science-practice-1',
    title: 'Planet Classification',
    phase: 'interactive-game',
    content: {
      question: 'Which planet is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1
    }
  },
  {
    id: 'science-practice-2',
    title: 'Solar System Facts',
    phase: 'interactive-game',
    content: {
      question: 'What is at the center of our solar system?',
      options: ['The Moon', 'Earth', 'The Sun', 'Mars'],
      correctAnswer: 2
    }
  }
];

const ScienceLearningContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("adaptive");

  const {
    phase,
    timeSpent,
    currentSegment,
    totalSegments,
    handleLessonStart,
    handleLessonComplete,
    handleLessonPause,
    handleLessonResume
  } = useUnifiedLesson();

  console.log('🔬 ScienceLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    currentMode,
    subject: 'science',
    skillArea: 'general_science',
    lessonPhase: phase
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in ScienceLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleModeChange = (mode: LearningMode) => {
    setCurrentMode(mode.id);
  };

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔬</div>
          <p className="text-lg">Loading your Science lesson...</p>
        </div>
      </div>
    );
  }

  // Don't render the component if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader
        title="Naturvidenskab med Nelie"
        onModeChange={handleModeChange}
        currentMode={currentMode}
      />
      <div className="max-w-4xl mx-auto p-6">
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
          subject="science"
          skillArea="general_science"
        />
      </div>
    </div>
  );
};

const ScienceLearning = () => {
  const navigate = useNavigate();
  
  const handleLessonComplete = () => {
    navigate('/daily-program');
  };

  return (
    <UnifiedLessonProvider
      subject="Science"
      allActivities={scienceActivities}
      onLessonComplete={handleLessonComplete}
    >
      <ScienceLearningContent />
    </UnifiedLessonProvider>
  );
};

export default ScienceLearning;
