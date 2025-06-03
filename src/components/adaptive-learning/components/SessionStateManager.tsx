
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { useAIInteractionLogger } from '@/hooks/useAIInteractionLogger';
import { useSessionLifecycle } from '@/hooks/useSessionLifecycle';
import { useSessionMetrics } from '@/hooks/useSessionMetrics';
import { useSessionActions } from '@/hooks/useSessionActions';

interface SessionStateManagerProps {
  subject: string;
  skillArea: string;
  onSessionReady: (sessionData: any) => void;
}

export const useSessionStateManager = ({ subject, skillArea, onSessionReady }: SessionStateManagerProps) => {
  const { user } = useAuth();
  const { logChatInteraction } = useAIInteractionLogger();
  
  // Use the smaller, focused hooks
  const sessionLifecycle = useSessionLifecycle();
  const sessionMetrics = useSessionMetrics();
  
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

  const sessionActions = useSessionActions({
    subject,
    skillArea,
    questionsCompleted: sessionMetrics.questionsCompleted,
    calculateFinalScore: sessionMetrics.calculateFinalScore,
    endSession,
    completeSession: sessionLifecycle.completeSession,
    resetSession: sessionLifecycle.resetSession,
    resetMetrics: sessionMetrics.resetMetrics
  });

  useEffect(() => {
    if (!isLoading && user) {
      sessionLifecycle.initializeSession();
      
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
        currentSession: sessionLifecycle.currentSession,
        sessionScore: sessionMetrics.sessionScore,
        questionsCompleted: sessionMetrics.questionsCompleted,
        showResults: sessionLifecycle.showResults
      });
    }
  }, [isLoading, user, difficulty, subject, skillArea, logChatInteraction, onSessionReady]);

  return {
    // Session lifecycle
    currentSession: sessionLifecycle.currentSession,
    showResults: sessionLifecycle.showResults,
    currentQuestionKey: sessionLifecycle.currentQuestionKey,
    
    // Session metrics
    sessionScore: sessionMetrics.sessionScore,
    questionsCompleted: sessionMetrics.questionsCompleted,
    setSessionScore: sessionMetrics.setSessionScore,
    setQuestionsCompleted: sessionMetrics.setQuestionsCompleted,
    
    // Adaptive learning state
    difficulty,
    performanceMetrics,
    userProgress,
    isLoading,
    recommendedSessionTime,
    sessionStartTime,
    recordAnswer,
    adjustDifficulty,
    endSession,
    
    // Session actions
    handleSessionComplete: sessionActions.handleSessionComplete,
    handleRetry: sessionActions.handleRetry
  };
};
