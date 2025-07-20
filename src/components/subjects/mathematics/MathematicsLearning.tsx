
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";
import ClassroomEnvironment from "../../education/components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "../../education/components/shared/classroomConfigs";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  const classroomConfig = getClassroomConfig("mathematics");

  console.log('🧮 MathematicsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'mathematics',
    skillArea: 'general_mathematics'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log(`[${classroomConfig?.subjectName || 'MathematicsLearning'}] Auth Check: Loading: ${loading}, User: ${user?.id}`);
    if (!loading && !user) {
      console.warn(`[${classroomConfig?.subjectName || 'MathematicsLearning'}] Redirecting to /auth. Loading: ${loading}, User: ${user === null}`);
      navigate('/auth');
    }
  }, [user, loading, navigate, classroomConfig?.subjectName]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from mathematics lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

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

  console.log('🎯 MathematicsLearning rendering UniversalLearning');

  return (
    <UniversalLearning 
      subject="mathematics" 
      skillArea="general_mathematics"
    />
  );
};

export default MathematicsLearning;
