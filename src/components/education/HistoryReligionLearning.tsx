
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UnifiedLessonManager from "./components/UnifiedLessonManager";
import ClassroomEnvironment from "./components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "./components/shared/classroomConfigs";

const HistoryReligionLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  const classroomConfig = getClassroomConfig("history_religion");

  console.log('📜 HistoryReligionLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'history_religion',
    skillArea: 'general_history_religion'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping Nelie speech due to navigation away from history religion lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  const handleBackToProgram = () => {
    console.log('🔇 Stopping Nelie speech before navigating back to program');
    forceStopAll();
    navigate('/');
  };

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">📜</div>
            <p className="text-lg">Loading your History & Religion lesson...</p>
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
          subject="history_religion"
          skillArea="general_history_religion"
          studentName={user.user_metadata?.first_name || 'Student'}
          onBackToProgram={handleBackToProgram}
        />
      </div>
    </ClassroomEnvironment>
  );
};

export default HistoryReligionLearning;
