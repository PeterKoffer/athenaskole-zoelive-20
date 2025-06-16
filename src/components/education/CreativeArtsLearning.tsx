
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";

const CreativeArtsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('🎨 CreativeArtsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'creative_arts',
    skillArea: 'general_creative_arts'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in CreativeArtsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg">Loading your Creative Arts lesson...</p>
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
          <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-400">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Creative Arts Studio</h2>
              <p className="text-purple-200">
                Let's explore creativity through art, design, and imagination!
              </p>
            </CardContent>
          </Card>
        </div>
        
        <AILearningModule 
          subject="creative_arts" 
          skillArea="general_creative_arts" 
          difficultyLevel={1}
          onBack={() => navigate('/daily-program')}
        />
      </div>
    </div>
  );
};

export default CreativeArtsLearning;
