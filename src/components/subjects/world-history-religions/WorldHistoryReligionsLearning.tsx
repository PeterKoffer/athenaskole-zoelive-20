
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const WorldHistoryReligionsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🕌 WorldHistoryReligionsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'world-history-religions',
    skillArea: 'world_history'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[WorldHistoryReligionsLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[WorldHistoryReligionsLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from world history religions lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🕌</div>
          <p className="text-lg">Loading your World History & Religions lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="world-history-religions" 
      skillArea="world_history"
    />
  );
};

export default WorldHistoryReligionsLearning;
