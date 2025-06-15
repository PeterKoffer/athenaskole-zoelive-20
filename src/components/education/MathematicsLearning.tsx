import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedMathematicsLearning from "./EnhancedMathematicsLearning";
import MathLearningIntroduction from "./components/math/MathLearningIntroduction";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";
import { useUnifiedSpeech } from "@/hooks/useUnifiedSpeech";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLesson, setShowLesson] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const classroomConfig = getClassroomConfig("mathematics");
  const { stop } = useUnifiedSpeech();

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

  const handleIntroComplete = () => {
    if (isAdvancing) return; // Prevent double trigger
    setIsAdvancing(true);
    setShowLesson(true);
    stop();
    console.log('🟢 [MathematicsLearning] onIntroductionComplete: showing lesson immediately, THEN stopping speech');
  };

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-10 px-2 flex items-center justify-center">
        {!showLesson ? (
          <MathLearningIntroduction onIntroductionComplete={handleIntroComplete} isAdvancing={isAdvancing} />
        ) : (
          <EnhancedMathematicsLearning />
        )}
      </div>
    </ClassroomEnvironment>
  );
};

export default MathematicsLearning;
