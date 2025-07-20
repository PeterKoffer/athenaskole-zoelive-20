
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";
import ClassroomEnvironment from "../../education/components/shared/ClassroomEnvironment";
import { getClassroomConfig } from "../../education/components/shared/classroomConfigs";

const GeographyLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();
  const classroomConfig = getClassroomConfig("geography");

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    return () => {
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl mb-4">🌎</div>
            <p className="text-lg">Loading your Geography lesson...</p>
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
      subject="geography" 
      skillArea="general_geography"
    />
  );
};

export default GeographyLearning;
