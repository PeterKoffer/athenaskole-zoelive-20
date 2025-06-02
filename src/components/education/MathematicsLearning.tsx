
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [aiSessionKey, setAiSessionKey] = useState(0);

  console.log('🔢 MathematicsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    aiSessionKey
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in MathematicsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔢</div>
          <p className="text-lg">Loading your Mathematics lesson...</p>
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
        <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400 mb-6">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-white">
              🤖 AI is generating personalized Mathematics questions for arithmetic practice
            </p>
          </CardContent>
        </Card>
        
        <AILearningModule 
          key={aiSessionKey} 
          subject="mathematics" 
          skillArea="arithmetic" 
          difficultyLevel={1}
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default MathematicsLearning;
