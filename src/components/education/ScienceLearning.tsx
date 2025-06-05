
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LessonPhaseRenderer from "./components/LessonPhaseRenderer";
import { useLessonStateManager } from "./components/LessonStateManager";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

const ScienceLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState("adaptive");

  const {
    lessonState,
    startLesson,
    completeLesson,
    pauseLesson,
    resumeLesson,
    backToProgram
  } = useLessonStateManager();

  console.log('🔬 ScienceLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    currentMode,
    subject: 'science',
    skillArea: 'general_science',
    lessonPhase: lessonState.phase
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
    backToProgram();
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
          lessonState={lessonState}
          onLessonStart={startLesson}
          onLessonComplete={completeLesson}
          onLessonResume={resumeLesson}
          onBackToProgram={handleBackToProgram}
          subject="science"
          skillArea="general_science"
        />
      </div>
    </div>
  );
};

export default ScienceLearning;
