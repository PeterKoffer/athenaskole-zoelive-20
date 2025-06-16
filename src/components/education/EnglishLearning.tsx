
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import OptimizedEnglishLearningContent from "./components/english/OptimizedEnglishLearningContent";

const EnglishLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('📚 EnglishLearning component rendering:', {
    user: !!user,
    userId: user?.id,
    loading,
    userMetadata: user?.user_metadata
  });

  useEffect(() => {
    console.log('📚 EnglishLearning useEffect triggered:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('📚 Redirecting to auth from EnglishLearning');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleBackToProgram = () => {
    console.log('📚 EnglishLearning - navigating back to daily program');
    navigate('/daily-program');
  };

  if (loading) {
    console.log('📚 EnglishLearning - showing loading state');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-lg">Loading your English lesson with Nelie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('📚 EnglishLearning - no user, returning null');
    return null;
  }

  console.log('📚 EnglishLearning - rendering OptimizedEnglishLearningContent');
  return (
    <OptimizedEnglishLearningContent onBackToProgram={handleBackToProgram} />
  );
};

export default EnglishLearning;
