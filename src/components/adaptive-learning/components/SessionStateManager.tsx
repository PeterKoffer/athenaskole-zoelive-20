
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { useAIInteractionLogger } from '@/hooks/useAIInteractionLogger';

interface SessionStateManagerProps {
  subject: string;
  skillArea: string;
  onSessionReady: (sessionData: any) => void;
}

export const useSessionStateManager = ({ subject, skillArea, onSessionReady }: SessionStateManagerProps) => {
  const { user } = useAuth();
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

      // Pass session data to parent
      onSessionReady({
        difficulty,
        performanceMetrics,
        userProgress,
        isLoading,
        recommendedSessionTime,
        sessionStartTime,
        recordAnswer,
        adjustDifficulty,
        endSession,
        currentSession,
        sessionScore,
        questionsCompleted,
        showResults
      });
    }
  }, [isLoading, user, difficulty, subject, skillArea, logChatInteraction, onSessionReady]);

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

    return finalScore;
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

  return {
    currentSession,
    sessionScore,
    questionsCompleted,
    showResults,
    currentQuestionKey,
    difficulty,
    performanceMetrics,
    userProgress,
    isLoading,
    recommendedSessionTime,
    sessionStartTime,
    recordAnswer,
    adjustDifficulty,
    endSession,
    handleSessionComplete,
    handleRetry,
    setSessionScore,
    setQuestionsCompleted
  };
};
