
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import EnhancedLearningSession from "@/components/adaptive-learning/components/EnhancedLearningSession";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, Target } from "lucide-react";

const EnglishLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessionKey, setSessionKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('📚 EnglishLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    sessionKey,
    isInitialized,
    subject: 'english',
    skillArea: 'reading_comprehension'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in EnglishLearning, redirecting to auth");
      navigate('/auth');
    } else if (!loading && user) {
      console.log("✅ User authenticated, initializing English learning");
      setIsInitialized(true);
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
  if (!user || !isInitialized) {
    return null;
  }

  const handleRetry = () => {
    console.log('🔄 Retrying English learning session');
    setSessionKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader 
        title="English Learning with Nelie"
        backTo="/daily-program"
        backLabel="Back to Program"
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 space-y-4">
          <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-400">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">English Reading Comprehension</h2>
              <p className="text-blue-200">
                Let's practice your English reading comprehension skills!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-900 to-emerald-900 border-green-400">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Brain className="w-6 h-6 text-green-400" />
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-white">
                🤖 AI is generating personalized English learning exercises
              </p>
            </CardContent>
          </Card>
        </div>
        
        <EnhancedLearningSession
          key={sessionKey}
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
