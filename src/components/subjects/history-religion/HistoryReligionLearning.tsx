
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const HistoryReligionLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🏛️ HistoryReligionLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'history-religion',
    skillArea: 'general_history'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[HistoryReligionLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[HistoryReligionLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from history religion lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 via-orange-800 to-red-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🏛️</div>
          <p className="text-lg">Loading your History & Religion lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="history-religion" 
      skillArea="general_history"
    />
  );
};

export default HistoryReligionLearning;
