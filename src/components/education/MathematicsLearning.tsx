
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedMathematicsLearning from "./EnhancedMathematicsLearning";
import MathLessonIntroCard from "./math/MathLessonIntroCard";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLesson, setShowLesson] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔢</div>
          <p className="text-lg">Loading your Mathematics lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show intro card first, then actual lesson after start
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-10 px-2">
      {!showLesson ? (
        <MathLessonIntroCard onStart={() => setShowLesson(true)} />
      ) : (
        <EnhancedMathematicsLearning />
      )}
    </div>
  );
};

export default MathematicsLearning;
