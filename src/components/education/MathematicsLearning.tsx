
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EnhancedMathematicsLearning from "./EnhancedMathematicsLearning";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const classroomConfig = getClassroomConfig("mathematics");

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log(`[${classroomConfig?.subjectName || 'MathematicsLearning'}] Auth Check: Loading: ${loading}, User: ${user?.id}`);
    if (!loading && !user) {
      console.warn(`[${classroomConfig?.subjectName || 'MathematicsLearning'}] Redirecting to /auth. Loading: ${loading}, User: ${user === null}`);
      navigate('/auth');
    }
  }, [user, loading, navigate, classroomConfig?.subjectName]);

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

  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="min-h-screen py-10 px-2 flex items-center justify-center">
        <EnhancedMathematicsLearning />
      </div>
    </ClassroomEnvironment>
  );
};

export default MathematicsLearning;
