
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NelieIntroduction from "./components/NelieIntroduction";

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
  const [showIntroduction, setShowIntroduction] = useState(true);

  console.log('📚 EnglishLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    sessionKey,
    isInitialized,
    currentMode,
    difficultyLevel,
    subject: 'english',
    skillArea: 'reading_comprehension',
    showIntroduction
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

  const handleIntroductionComplete = () => {
    console.log("✅ English introduction completed, starting main lesson");
    setShowIntroduction(false);
  };

  const handleBackToProgram = () => {
    navigate('/daily-program');
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-lg">Loading your English lesson with Nelie...</p>
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToProgram}
            className="border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">English Learning with Nelie</h1>
            <p className="text-gray-400">Reading comprehension and language skills</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        {showIntroduction ? (
          <NelieIntroduction 
            subject="english"
            skillArea="reading_comprehension"
            onIntroductionComplete={handleIntroductionComplete}
          />
        ) : (
          <div className="space-y-6">
            <div className="mb-6">
              <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 border-blue-400">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-white mb-2">English Reading Comprehension</h2>
                  <p className="text-blue-200 mb-2">
                    Let's practice your English reading comprehension skills with Nelie!
                  </p>
                  <p className="text-xs text-blue-300">
                    Mode: {currentMode === 'adaptive' ? 'Adaptive Learning' : 
                           currentMode === 'focused' ? 'Focused Training' :
                           currentMode === 'challenge' ? 'Challenge Mode' :
                           currentMode === 'mastery' ? 'Mastery Mode' : 'Group Learning'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <AILearningModule
              key={sessionKey}
              subject="english" 
              skillArea="reading_comprehension" 
              difficultyLevel={difficultyLevel}
              onBack={handleBackToProgram}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishLearning;
