
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: string;
  estimatedTime: string;
  benefits: string[];
}

const EnglishLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessionKey, setSessionKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentMode, setCurrentMode] = useState("adaptive");
  const [difficultyLevel, setDifficultyLevel] = useState(2);

  console.log('📚 EnglishLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    sessionKey,
    isInitialized,
    currentMode,
    difficultyLevel,
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
    setSessionKey(prev => prev + 1);
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader 
        title="English Learning with Nelie"
        backTo="/daily-program"
        backLabel="Back to Program"
        onModeChange={handleModeChange}
        currentMode={currentMode}
      />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="mb-4 sm:mb-6">
          <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-400">
            <CardContent className="p-4 sm:p-6 text-center">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">English Reading Comprehension</h2>
              <p className="text-sm sm:text-base text-blue-200 mb-2">
                Let's practice your English reading comprehension skills!
              </p>
              <p className="text-xs text-blue-300">
                Mode: {currentMode === 'adaptive' ? 'Adaptiv læring' : 
                       currentMode === 'focused' ? 'Fokuseret træning' :
                       currentMode === 'challenge' ? 'Udfordrings mode' :
                       currentMode === 'mastery' ? 'Mestring mode' : 'Gruppe læring'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <AILearningModule
          key={sessionKey}
          subject="english" 
          skillArea="reading_comprehension" 
          difficultyLevel={difficultyLevel}
          onBack={() => navigate('/daily-program')}
        />
      </div>
    </div>
  );
};

export default EnglishLearning;
