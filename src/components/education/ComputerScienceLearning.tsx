
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, ArrowLeft, LogIn } from "lucide-react";
import AILearningModule from "@/components/adaptive-learning/AILearningModule";

const ComputerScienceLearning = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('💻 ComputerScienceLearning component state:', {
    user: !!user,
    userId: user?.id,
    loading,
    subject: 'computer_science',
    skillArea: 'programming_basics'
  });

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💻</div>
          <p className="text-lg">Loading your Computer Science lesson...</p>
        </div>
      </div>
    );
  }

  // Show login options if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <LearningHeader />
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-400">
              <CardContent className="p-6 text-center">
                <Code className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white mb-2">Computer Science & AI</h2>
                <p className="text-blue-200">
                  Learn programming, algorithms, and artificial intelligence fundamentals!
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-red-900 border-red-700">
            <CardContent className="p-8 text-center text-white">
              <Code className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Login Required</h3>
              <p className="text-red-300 mb-8 text-lg">You need to be logged in to use AI learning.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login / Sign Up
                </Button>
                
                <Button
                  onClick={() => navigate('/daily-program')}
                  variant="outline"
                  className="border-gray-600 text-gray-200 hover:bg-gray-700 px-8 py-3 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LearningHeader />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-400">
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Computer Science & AI</h2>
              <p className="text-blue-200">
                Learn programming, algorithms, and artificial intelligence fundamentals!
              </p>
            </CardContent>
          </Card>
        </div>
        
        <AILearningModule 
          subject="computer_science" 
          skillArea="programming_basics" 
          difficultyLevel={1}
          onBack={() => navigate('/daily-program')}
        />
      </div>
    </div>
  );
};

export default ComputerScienceLearning;
