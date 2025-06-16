
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { UnifiedLessonProvider, useUnifiedLesson } from "./contexts/UnifiedLessonContext";
import { LessonActivity } from "./components/types/LessonTypes";

// Sample activities for Science - these would normally come from a curriculum system
const scienceActivities: LessonActivity[] = [
  {
    id: 'science-intro-1',
    title: 'Introduction to the Solar System',
    type: 'introduction',
    phase: 'introduction',
    duration: 300,
    phaseDescription: 'Welcome introduction to solar system concepts',
    content: {
      hook: 'Welcome to today\'s science lesson! We\'ll explore our solar system and the planets within it.'
    }
  },
  {
    id: 'science-practice-1',
    title: 'Planet Classification',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 600,
    phaseDescription: 'Interactive quiz about planet classification',
    content: {
      question: 'Which planet is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1
    }
  },
  {
    id: 'science-practice-2',
    title: 'Solar System Facts',
    type: 'interactive-game',
    phase: 'interactive-game',
    duration: 600,
    phaseDescription: 'Quiz about solar system fundamentals',
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

  console.log('🔬 ScienceLearningContent rendering:', {
    user: !!user,
    userId: user?.id,
    loading,
    currentMode
  });

  // This hook might be causing issues if the context is not properly set up
  let lessonData;
  try {
    lessonData = useUnifiedLesson();
    console.log('🔬 Unified lesson data:', lessonData);
  } catch (error) {
    console.error('🔬 Error getting unified lesson data:', error);
    lessonData = {
      phase: 'introduction',
      timeSpent: 0,
      currentSegment: 0,
      totalSegments: scienceActivities.length,
      handleLessonStart: () => {},
      handleLessonComplete: () => navigate('/daily-program'),
      handleLessonPause: () => {},
      handleLessonResume: () => {}
    };
  }

  const {
    phase,
    timeSpent,
    currentSegment,
    totalSegments,
    handleLessonStart,
    handleLessonComplete,
    handleLessonPause,
    handleLessonResume
  } = lessonData;

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('🔬 ScienceLearning useEffect:', { user: !!user, loading });
    if (!loading && !user) {
      console.log("🚪 User not authenticated in ScienceLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleModeChange = (mode: any) => {
    console.log('🔬 Mode change:', mode);
    setCurrentMode(mode.id);
  };

  const handleBackToProgram = () => {
    console.log('🔬 ScienceLearning - navigating back to daily program');
    navigate('/daily-program');
  };

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('🔬 ScienceLearning - showing loading state');
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
    console.log('🔬 ScienceLearning - no user, returning null');
    return null;
  }

  console.log('🔬 ScienceLearning - rendering main content');
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
            score: 0
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
  
  console.log('🔬 ScienceLearning wrapper rendering');
  
  const handleLessonComplete = () => {
    console.log('🔬 Science lesson completed');
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
