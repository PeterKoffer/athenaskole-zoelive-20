
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth"; // Import UserMetadata
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UnifiedLessonManager from "./components/UnifiedLessonManager";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";

const CreativeArtsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  const classroomConfig = getClassroomConfig("creative_arts");

  console.log('🎨 CreativeArtsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'creative_arts',
    skillArea: 'general_creative_arts'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in CreativeArtsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from creative arts lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to program');
    forceStopAll();
    navigate('/daily-program');
  };

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg">Loading your Creative Arts lesson...</p>
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
        <UnifiedLessonManager
          subject="creative_arts"
          skillArea="general_creative_arts"
          studentName={(user.user_metadata as UserMetadata)?.first_name || 'Student'}
          onBackToProgram={handleBackToProgram}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default CreativeArtsLearning;
