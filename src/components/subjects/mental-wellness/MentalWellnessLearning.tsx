
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const MentalWellnessLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🧠 MentalWellnessLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'mental-wellness',
    skillArea: 'general_wellness'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[MentalWellnessLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[MentalWellnessLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from mental wellness lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🧠</div>
          <p className="text-lg">Loading your Mental Wellness lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="mental-wellness" 
      skillArea="general_wellness"
    />
  );
};

export default MentalWellnessLearning;
