
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedMathematicsLearning from "./EnhancedMathematicsLearning";
// Removed: import MathLessonIntroCard from "./math/MathLessonIntroCard";
import MathLearningIntroduction from "./components/math/MathLearningIntroduction";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLesson, setShowLesson] = useState(false);
  const classroomConfig = getClassroomConfig("mathematics");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🔢</div>
            <p className="text-lg">Loading your Mathematics lesson...</p>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  if (!user) {
    return null;
  }

  // Show the intro flow (like English class), then the actual lesson
  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-10 px-2 flex items-center justify-center">
        {!showLesson ? (
          <MathLearningIntroduction onIntroductionComplete={() => setShowLesson(true)} />
        ) : (
          <EnhancedMathematicsLearning />
        )}
      </div>
    </ClassroomEnvironment>
  );
};

export default MathematicsLearning;

