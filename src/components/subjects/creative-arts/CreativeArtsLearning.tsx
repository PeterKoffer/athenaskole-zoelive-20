
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const CreativeArtsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🎨 CreativeArtsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'creative-arts',
    skillArea: 'general_arts'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[CreativeArtsLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[CreativeArtsLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from creative arts lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-rose-800 to-red-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg">Loading your Creative Arts lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="creative-arts" 
      skillArea="general_arts"
    />
  );
};

export default CreativeArtsLearning;
