
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [aiSessionKey, setAiSessionKey] = useState(0);
  const [currentMode, setCurrentMode] = useState("adaptive");
  const [difficultyLevel, setDifficultyLevel] = useState(2);

  console.log('🔢 MathematicsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    aiSessionKey,
    currentMode,
    difficultyLevel,
    subject: 'mathematics',
    skillArea: 'arithmetic'
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log("🚪 User not authenticated in MathematicsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleModeChange = (mode: LearningMode) => {
    setCurrentMode(mode.id);
    
    // Set difficulty based on mode
    switch (mode.id) {
      case 'adaptive':
        setDifficultyLevel(2);
        break;
      case 'focused':
        setDifficultyLevel(1);
        break;
      case 'challenge':
        setDifficultyLevel(4);
        break;
      case 'mastery':
        setDifficultyLevel(1);
        break;
      case 'group':
        setDifficultyLevel(2);
        break;
      default:
        setDifficultyLevel(2);
    }
    
    // Restart the AI session with new mode
    setAiSessionKey(prev => prev + 1);
  };

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
      <LearningHeader 
        title="Matematik med Nelie"
        onModeChange={handleModeChange}
        currentMode={currentMode}
      />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400">
            <CardContent className="p-6 text-center">
              <Calculator className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Mathematics Practice</h2>
              <p className="text-green-200">
                Let's practice your mathematics arithmetic skills!
              </p>
              <p className="text-xs text-green-300 mt-2">
                Mode: {currentMode === 'adaptive' ? 'Adaptiv læring' : 
                       currentMode === 'focused' ? 'Fokuseret træning' :
                       currentMode === 'challenge' ? 'Udfordrings mode' :
                       currentMode === 'mastery' ? 'Mestring mode' : 'Gruppe læring'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <AILearningModule 
          key={aiSessionKey} 
          subject="mathematics" 
          skillArea="arithmetic" 
          difficultyLevel={difficultyLevel}
          onBack={() => navigate('/daily-program')}
        />
      </div>
    </div>
  );
};

export default MathematicsLearning;
