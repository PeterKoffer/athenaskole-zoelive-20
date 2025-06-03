
import { useCallback } from 'react';
import { useAIInteractionLogger } from '@/hooks/useAIInteractionLogger';

interface SessionActionsProps {
  subject: string;
  skillArea: string;
  questionsCompleted: number;
  calculateFinalScore: () => number;
  endSession: () => Promise<void>;
  completeSession: () => void;
  resetSession: () => void;
  resetMetrics: () => void;
}

export const useSessionActions = ({
  subject,
  skillArea,
  questionsCompleted,
  calculateFinalScore,
  endSession,
  completeSession,
  resetSession,
  resetMetrics
}: SessionActionsProps) => {
  const { logChatInteraction } = useAIInteractionLogger();

  const handleSessionComplete = useCallback(async () => {
    const finalScore = calculateFinalScore();
    
    await endSession();
    completeSession();

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
  }, [subject, skillArea, questionsCompleted, calculateFinalScore, endSession, completeSession, logChatInteraction]);

  const handleRetry = useCallback(() => {
    resetSession();
    resetMetrics();
  }, [resetSession, resetMetrics]);

  return {
    handleSessionComplete,
    handleRetry
  };
};
