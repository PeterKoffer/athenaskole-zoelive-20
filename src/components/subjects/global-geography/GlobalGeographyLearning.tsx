
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const GlobalGeographyLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🗺️ GlobalGeographyLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'global-geography',
    skillArea: 'global_geography'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[GlobalGeographyLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[GlobalGeographyLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from global geography lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-teal-800 to-green-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-lg">Loading your Global Geography lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="global-geography" 
      skillArea="global_geography"
    />
  );
};

export default GlobalGeographyLearning;
