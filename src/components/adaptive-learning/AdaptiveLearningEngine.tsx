
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Target, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AILearningModule from './AILearningModule';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { useAIInteractionLogger } from '@/hooks/useAIInteractionLogger';

interface AdaptiveLearningEngineProps {
  subject: string;
  skillArea: string;
  onComplete?: (score: number) => void;
}

const AdaptiveLearningEngine = ({ subject, skillArea, onComplete }: AdaptiveLearningEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logChatInteraction } = useAIInteractionLogger();
  const [currentSession, setCurrentSession] = useState<'loading' | 'active' | 'completed'>('loading');
  const [sessionScore, setSessionScore] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionKey, setCurrentQuestionKey] = useState(0);

  const {
    difficulty,
    performanceMetrics,
    userProgress,
    isLoading,
    recommendedSessionTime,
    sessionStartTime,
    recordAnswer,
    adjustDifficulty,
    endSession
  } = useAdaptiveLearning(subject, skillArea);

  useEffect(() => {
    if (!isLoading && user) {
      setCurrentSession('active');
      
      // Log the start of AI learning session
      logChatInteraction(
        `Starting AI adaptive learning session for ${subject} - ${skillArea}`,
        `Session initialized at difficulty level ${difficulty}`,
        undefined,
        undefined,
        true,
        undefined,
        subject,
        skillArea
      );
    }
  }, [isLoading, user, difficulty, subject, skillArea, logChatInteraction]);

  const handleSessionComplete = async () => {
    const finalScore = questionsCompleted > 0 ? Math.round(sessionScore / questionsCompleted) : 0;
    
    await endSession();
    setCurrentSession('completed');
    setShowResults(true);

    // Log session completion
    await logChatInteraction(
      `AI learning session completed for ${subject} - ${skillArea}`,
      `Final score: ${finalScore}%, Questions completed: ${questionsCompleted}`,
      undefined,
      undefined,
      true,
      undefined,
      subject,
      skillArea
    );

    if (onComplete) {
      onComplete(finalScore);
    }

    toast({
      title: "Session Completed! 🎓",
      description: `Du gennemførte ${questionsCompleted} spørgsmål med en gennemsnitsscore på ${finalScore}%`,
      duration: 5000
    });
  };

  const handleRetry = () => {
    setCurrentSession('loading');
    setSessionScore(0);
    setQuestionsCompleted(0);
    setShowResults(false);
    setCurrentQuestionKey(prev => prev + 1);
    
    // Re-initialize the session
    setTimeout(() => {
      if (!isLoading && user) {
        setCurrentSession('active');
      }
    }, 1000);
  };

  const handleModuleBack = () => {
    // Handle back navigation from AI module
    window.history.back();
  };

  if (!user) {
    return (
      <Card className="bg-red-900 border-red-700">
        <CardContent className="p-6 text-center text-white">
          <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-red-300">Du skal være logget ind for at bruge AI-læring.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || currentSession === 'loading') {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Forbereder AI-læring...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const finalScore = questionsCompleted > 0 ? Math.round(sessionScore / questionsCompleted) : 0;
    
    return (
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-400">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="w-5 h-5 text-lime-400" />
            <span>Session Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-lime-400">{questionsCompleted}</div>
              <div className="text-sm text-gray-300">Spørgsmål gennemført</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-lime-400">{finalScore}%</div>
              <div className="text-sm text-gray-300">Gennemsnitsscore</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-lime-400">{difficulty}</div>
              <div className="text-sm text-gray-300">Sværhedsgrad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-lime-400">{Math.round(performanceMetrics.accuracy)}%</div>
              <div className="text-sm text-gray-300">Nøjagtighed</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleRetry}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black"
            >
              <Brain className="w-4 h-4 mr-2" />
              Start ny session
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
            >
              Tilbage til oversigt
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Progress */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-lime-400" />
              <span className="text-white font-medium">AI Learning Session</span>
            </div>
            <Badge className="bg-lime-400 text-black">
              Level {difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Spørgsmål: {questionsCompleted}/5</span>
            <span>Nøjagtighed: {Math.round(performanceMetrics.accuracy)}%</span>
          </div>
          
          <Progress 
            value={(questionsCompleted / 5) * 100} 
            className="h-2" 
          />
        </CardContent>
      </Card>

      {/* AI Learning Module */}
      <AILearningModule
        key={currentQuestionKey} // Force re-render for new questions
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={difficulty}
        onBack={handleModuleBack}
      />

      {/* Performance Indicators */}
      {performanceMetrics.totalAttempts > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5 text-lime-400" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-lime-400">
                {Math.round(performanceMetrics.accuracy)}%
              </div>
              <div className="text-xs text-gray-400">Nøjagtighed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-lime-400">
                {Math.round(performanceMetrics.averageTime)}s
              </div>
              <div className="text-xs text-gray-400">Gns. tid</div>
            </div>
            <div>
              <div className="text-lg font-bold text-lime-400">
                {performanceMetrics.totalAttempts}
              </div>
              <div className="text-xs text-gray-400">Forsøg</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdaptiveLearningEngine;
