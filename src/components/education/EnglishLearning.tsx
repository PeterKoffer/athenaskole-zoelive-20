
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const EnglishLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [aiSessionKey, setAiSessionKey] = useState(0);

  console.log('📚 EnglishLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    aiSessionKey,
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
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-400 mb-6">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white">
              🤖 AI is generating personalized English questions for reading comprehension
            </p>
          </CardContent>
        </Card>
        
        <AILearningModule 
          key={aiSessionKey} 
          subject="english" 
          skillArea="reading_comprehension" 
          difficultyLevel={1}
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default EnglishLearning;
