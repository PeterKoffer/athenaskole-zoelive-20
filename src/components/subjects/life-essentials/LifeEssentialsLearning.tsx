
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const LifeEssentialsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🏠 LifeEssentialsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'life-essentials',
    skillArea: 'general_life_skills'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[LifeEssentialsLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[LifeEssentialsLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from life essentials lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-lg">Loading your Life Essentials lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="life-essentials" 
      skillArea="general_life_skills"
    />
  );
};

export default LifeEssentialsLearning;
