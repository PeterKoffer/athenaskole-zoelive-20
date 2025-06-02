import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import MathHeader from "./math/MathHeader";
import MathQuestion from "./math/MathQuestion";
import SessionTimer from "../adaptive-learning/SessionTimer";
import LearningHeader from "./LearningHeader";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const MathematicsLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [useAIQuestions, setUseAIQuestions] = useState(false);
  const [aiSessionKey, setAiSessionKey] = useState(0);
  
  // Existing state for regular questions
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  console.log('🔢 MathematicsLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    useAIQuestions,
    aiSessionKey
  });

  const {
    difficulty,
    performanceMetrics,
    recommendedSessionTime,
    recordAnswer,
    adjustDifficulty,
    endSession
  } = useAdaptiveLearning('mathematics', 'arithmetic');

  // Redirect to auth if not logged in - but only after loading is complete
  useEffect(() => {
    console.log('🔍 Auth check effect:', { loading, hasUser: !!user });
    if (!loading && !user) {
      console.log("🚪 User not authenticated in MathematicsLearning, redirecting to auth");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Sample math questions
  const questions = [
    {
      question: 'What is 15 + 27?',
      options: ['40', '42', '45', '48'],
      correct: 1,
      explanation: '15 + 27 = 42',
      difficulty: 1
    },
    {
      question: 'What is 8 × 7?',
      options: ['54', '56', '58', '64'],
      correct: 1,
      explanation: '8 × 7 = 56',
      difficulty: 2
    }
  ];

  const handleStartAIQuestions = () => {
    console.log('🚀 STARTING AI QUESTIONS MODE');
    console.log('👤 Current user:', user?.id);
    setUseAIQuestions(true);
    setAiSessionKey(prev => {
      const newKey = prev + 1;
      console.log('🔑 New AI session key:', newKey);
      return newKey;
    });
  };

  const handleAIComplete = (score: number) => {
    console.log('✅ AI Learning completed with score:', score);
    setUseAIQuestions(false);
    setShowResults(true);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const startTime = Date.now() - 5000; // Simulate 5 seconds thinking time
    const responseTime = Date.now() - startTime;
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    setShowResult(true);
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    recordAnswer(isCorrect, responseTime);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setShowResults(true);
      endSession();
    }
  };

  const handleDifficultyChange = (newLevel: number, reason: string) => {
    adjustDifficulty(newLevel, reason);
  };

  // Show loading state while authentication is being checked
  if (loading) {
    console.log('⏳ Showing loading state - auth check in progress');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔢</div>
          <p className="text-lg">Loading your math lesson...</p>
        </div>
      </div>
    );
  }

  // Don't render the component if user is not authenticated
  if (!user) {
    console.log('❌ No user - component not rendering');
    return null;
  }

  console.log('🎯 Rendering main component with useAIQuestions:', useAIQuestions);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LearningHeader />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Great work!</h1>
            <p className="text-xl">You scored {score} out of {questions.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Session Complete!</h3>
            <p className="text-gray-300">Keep practicing to improve your math skills!</p>
            <Button 
              onClick={() => setShowResults(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show AI Questions Mode
  if (useAIQuestions) {
    console.log('🤖 Rendering AI Questions mode with session key:', aiSessionKey);
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LearningHeader />
        <div className="max-w-4xl mx-auto p-6">
          <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400 mb-6">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-lime-400 mx-auto mb-2" />
              <p className="text-white">
                🤖 AI is generating a REAL personalized math question for fractions
              </p>
              <Button 
                onClick={() => setUseAIQuestions(false)}
                variant="outline"
                className="mt-2 border-gray-600 text-white hover:bg-gray-700"
              >
                Back to Regular Questions
              </Button>
            </CardContent>
          </Card>
          
          <AILearningModule
            key={aiSessionKey}
            subject="matematik"
            skillArea="fractions"
            onComplete={handleAIComplete}
          />
        </div>
      </div>
    );
  }

  // Show selection between AI and Regular questions
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-center">Choose Your Learning Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-gradient-to-r from-lime-900 to-green-900 border-lime-400">
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-lime-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI-Generated Questions</h3>
                <p className="text-lime-200 mb-4">
                  Get personalized math questions generated by AI based on your skill level
                </p>
                <Button
                  onClick={handleStartAIQuestions}
                  className="bg-lime-400 hover:bg-lime-500 text-black font-semibold"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start AI Math Questions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🔢</div>
                <h3 className="text-xl font-bold text-white mb-2">Regular Questions</h3>
                <p className="text-gray-300 mb-4">
                  Practice with our predefined math questions
                </p>
                <Button
                  onClick={() => {
                    console.log('📚 Starting regular questions mode');
                    // This will render the regular math questions below
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Regular Math
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Regular Math Questions - show only if not using AI */}
        {!useAIQuestions && (
          <>
            <SessionTimer 
              recommendedDuration={recommendedSessionTime}
            />
            <MathHeader 
              score={score} 
              totalQuestions={questions.length}
              currentQuestion={currentQuestion}
              difficulty={difficulty}
              performanceMetrics={performanceMetrics}
              onDifficultyChange={handleDifficultyChange}
            />
            <MathQuestion
              question={questions[currentQuestion]}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={handleSubmit}
              onNext={handleNext}
              isLastQuestion={currentQuestion === questions.length - 1}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MathematicsLearning;
