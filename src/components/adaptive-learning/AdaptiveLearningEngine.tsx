
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AILearningModule from './AILearningModule';
import { useSessionStateManager } from './components/SessionStateManager';
import SessionResultsCard from './components/SessionResultsCard';
import SessionProgressCard from './components/SessionProgressCard';
import PerformanceIndicatorsCard from './components/PerformanceIndicatorsCard';

interface AdaptiveLearningEngineProps {
  subject: string;
  skillArea: string;
  onComplete?: (score: number) => void;
}

const AdaptiveLearningEngine = ({ subject, skillArea, onComplete }: AdaptiveLearningEngineProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<any>(null);

  const {
    currentSession,
    sessionScore,
    questionsCompleted,
    showResults,
    currentQuestionKey,
    difficulty,
    performanceMetrics,
    isLoading,
    handleSessionComplete,
    handleRetry
  } = useSessionStateManager({
    subject,
    skillArea,
    onSessionReady: (data) => setSessionData(data)
  });

  const handleModuleBack = () => {
    window.history.back();
  };

  const handleCompleteWithToast = async () => {
    const finalScore = await handleSessionComplete();
    
    if (onComplete) {
      onComplete(finalScore);
    }

    toast({
      title: "Session Completed! 🎓",
      description: `Du gennemførte ${questionsCompleted} spørgsmål med en gennemsnitsscore på ${finalScore}%`,
      duration: 5000
    });
  };

  const handleRetrySession = () => {
    handleRetry();
    toast({
      title: "Starting New Session",
      description: "Preparing your next AI learning session...",
      duration: 3000
    });
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
    return (
      <SessionResultsCard
        questionsCompleted={questionsCompleted}
        sessionScore={sessionScore}
        difficulty={difficulty}
        performanceAccuracy={performanceMetrics.accuracy}
        onRetry={handleRetrySession}
        onBack={() => window.history.back()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SessionProgressCard
        difficulty={difficulty}
        questionsCompleted={questionsCompleted}
        performanceAccuracy={performanceMetrics.accuracy}
      />

      <AILearningModule
        key={currentQuestionKey}
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={difficulty}
        onBack={handleModuleBack}
      />

      <PerformanceIndicatorsCard performanceMetrics={performanceMetrics} />
    </div>
  );
};

export default AdaptiveLearningEngine;
