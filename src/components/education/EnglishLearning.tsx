
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import EnhancedLearningSession from "@/components/adaptive-learning/components/EnhancedLearningSession";

const EnglishLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessionKey, setSessionKey] = useState(0);

  console.log('📚 EnglishLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    sessionKey,
    subject: 'english',
    skillArea: 'reading_comprehension'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in EnglishLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-lg">Loading your English lesson...</p>
        </div>
      </div>
    );
  }

  // Don't render the component if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">English Learning with Nelie</h1>
          <p className="text-gray-300">Let's practice your English reading comprehension skills!</p>
        </div>
        
        <EnhancedLearningSession
          key={`english-${sessionKey}`}
          subject="english" 
          skillArea="reading_comprehension" 
          difficultyLevel={1}
          onBack={() => navigate('/daily-program')}
        />
      </div>
    </div>
  );
};

export default EnglishLearning;
