
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";
import ClassroomEnvironment from "../../education/components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "../../education/components/shared/classroomConfigs";

const ScienceLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  const classroomConfig = getClassroomConfig("science");

  console.log('🔬 ScienceLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'science',
    skillArea: 'general_science'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[ScienceLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[ScienceLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from science lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  const handleBackToProgram = () => {
    console.log('🔇 Stopping speech before navigating back to program');
    forceStopAll();
    navigate('/daily-program');
  };

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🔬</div>
            <p className="text-lg">Loading your Science lesson...</p>
          </div>
        </div>
      </ClassroomEnvironment>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="science" 
      skillArea="general_science"
    />
  );
};

export default ScienceLearning;
