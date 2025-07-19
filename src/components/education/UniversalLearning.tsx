
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserMetadata } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UnifiedLessonManager from "./components/UnifiedLessonManager";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";

interface UniversalLearningProps {
  subject: string;
  skillArea: string;
}

const UniversalLearning = ({ subject, skillArea }: UniversalLearningProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  
  // Get classroom config based on subject, fallback to default
  const classroomConfig = getClassroomConfig(subject) || getClassroomConfig("default");

  console.log('🎯 UniversalLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject,
    skillArea
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in UniversalLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from universal learning lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to training ground');
    forceStopAll();
    navigate('/training-ground');
  };

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-lg">Loading your {subject} lesson...</p>
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
          subject={subject}
          skillArea={skillArea}
          studentName={(user.user_metadata as UserMetadata)?.first_name || 'Student'}
          onBackToProgram={handleBackToProgram}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearning;
