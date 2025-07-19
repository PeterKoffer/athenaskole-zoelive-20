
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const GeographyLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🌎 GeographyLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'geography',
    skillArea: 'general_geography'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[GeographyLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[GeographyLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from geography lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🌎</div>
          <p className="text-lg">Loading your Geography lesson...</p>
        </div>
      </div>
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
