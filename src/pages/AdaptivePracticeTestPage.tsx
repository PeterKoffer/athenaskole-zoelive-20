
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdaptivePracticeModule from '@/components/adaptive-learning/AdaptivePracticeModule';
import FocusedGrade3Test from '@/components/adaptive-learning/components/FocusedGrade3Test';
import Grade3FractionTestTrigger from '@/components/adaptive-learning/components/Grade3FractionTestTrigger';

const AdaptivePracticeTestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModule, setShowModule] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showGrade3Tests, setShowGrade3Tests] = useState(false);

  console.log('🧪 AdaptivePracticeTestPage rendering...');

  const handleStartPractice = () => {
    console.log('🚀 Starting adaptive practice - showing immediate loading...');
    setIsInitializing(true);
    // Small delay to show loading state, then show module
    setTimeout(() => {
      setShowModule(true);
      setIsInitializing(false);
    }, 500);
  };

  const handleBack = () => {
    console.log('⬅️ Navigating back...');
    navigate('/');
  };

  if (showModule) {
    return (
      <div className="relative">
        <AdaptivePracticeModule onBack={handleBack} />
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Preparing Your Learning Experience
            </h2>
            <p className="text-gray-300 mb-6">
              Setting up personalized content just for you...
            </p>
            <Progress value={75} className="w-full h-3" />
            <p className="text-sm text-gray-400 mt-4">
              This will only take a moment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-16 h-16 text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              AI-Powered Learning Assessment
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Experience personalized learning that adapts to your knowledge level
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8 pb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">What You'll Get:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Personalized questions based on your current knowledge
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Adaptive difficulty that matches your learning pace
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Immediate feedback and explanations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Progress tracking and learning insights
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How It Works:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">1.</span>
                    AI analyzes your current knowledge level
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">2.</span>
                    Generates personalized questions in real-time
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">3.</span>
                    Adapts difficulty based on your performance
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">4.</span>
                    Provides insights to guide your learning
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-700">
              <div className="mb-6">
                <Button
                  onClick={() => setShowGrade3Tests(!showGrade3Tests)}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white mb-4"
                >
                  {showGrade3Tests ? 'Hide' : 'Show'} Grade 3 Fraction Tests (Dev Tools)
                </Button>
              </div>
              
              <Button
                onClick={handleStartPractice}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-12 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Learning Now
              </Button>
              <p className="text-sm text-gray-400 mt-3">
                Takes about 10-15 minutes • Completely personalized
              </p>
            </div>
          </CardContent>
        </Card>

        {showGrade3Tests && (
          <div className="mt-8 space-y-6">
            <FocusedGrade3Test />
            <Grade3FractionTestTrigger />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptivePracticeTestPage;
