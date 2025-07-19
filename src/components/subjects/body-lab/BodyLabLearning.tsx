
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const BodyLabLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🫀 BodyLabLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'body-lab',
    skillArea: 'general_anatomy'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[BodyLabLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[BodyLabLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from body lab lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-800 to-rose-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🫀</div>
          <p className="text-lg">Loading your Body Lab lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="body-lab" 
      skillArea="general_anatomy"
    />
  );
};

export default BodyLabLearning;
