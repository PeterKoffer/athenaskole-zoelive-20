
import { ScenarioSession } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface UseScenarioCompletionProps {
  session: ScenarioSession | null;
  score: number;
  updateSession: (updates: Partial<ScenarioSession>) => void;
  logSessionEnd: (reason: 'COMPLETION' | 'USER_INITIATED', session: ScenarioSession) => void;
  onComplete: () => void;
  onExit: () => void;
}

export const useScenarioCompletion = ({
  session,
  score: _score,
  updateSession,
  logSessionEnd,
  onComplete,
  onExit
}: UseScenarioCompletionProps) => {
  const { speakAsNelie } = useUnifiedSpeech();

  const handleComplete = () => {
    if (session) {
      const finalSession = {
        ...session,
        status: 'completed' as const,
        timestamps: {
          ...session.timestamps,
          completedAt: new Date()
        }
      };
      updateSession(finalSession);
      
      logSessionEnd('COMPLETION', session);
      console.log('✅ Final session:', finalSession);
    }
    
    speakAsNelie("Congratulations! You've completed the scenario!", true, 'completion');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleExit = () => {
    if (session) {
      logSessionEnd('USER_INITIATED', session);
    }
    onExit();
  };

  return {
    handleComplete,
    handleExit
  };
};
