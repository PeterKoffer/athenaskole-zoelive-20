
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import UniversalLearning from "../../education/UniversalLearning";

const LanguageLabLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { forceStopAll } = useUnifiedSpeech();

  console.log('🌍 LanguageLabLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'language-lab',
    skillArea: 'general_languages'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    console.log('[LanguageLabLearning] Auth Check: Loading:', loading, 'User:', user?.id);
    if (!loading && !user) {
      console.warn('[LanguageLabLearning] Redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔇 Stopping speech due to navigation away from language lab lesson');
      forceStopAll();
    };
  }, [forceStopAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🌍</div>
          <p className="text-lg">Loading your Language Lab lesson...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UniversalLearning 
      subject="language-lab" 
      skillArea="general_languages"
    />
  );
};

export default LanguageLabLearning;
