
import { useEffect, useState } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeContent from './WelcomeContent';
import NelieAvatarDisplay from './NelieAvatarDisplay';

interface HomepageWelcomeProps {
  userName: string;
}

const HomepageWelcome = ({ userName }: HomepageWelcomeProps) => {
  const [hasWelcomedThisSession, setHasWelcomedThisSession] = useState(() => {
    return sessionStorage.getItem('nelieHomepageWelcomed') === 'true';
  });
  
  const [hasManuallyTriggered, setHasManuallyTriggered] = useState(false);
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    speak,
    stop,
    toggleEnabled,
  } = useUnifiedSpeech();

  console.log('🏠 Homepage Welcome State:', {
    hasWelcomedThisSession,
    hasManuallyTriggered,
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady
  });

  // Create the welcome message that will be used for both scenarios
  const welcomeMessage = `Hello ${userName}! Welcome back to your learning platform! I'm Nelie, your AI learning companion, and I'm so excited to help you learn today! Click on any subject to start your learning adventure with me!`;

  // Auto-enable Nelie and trigger welcome speech after first interaction (but only if not manually triggered)
  useEffect(() => {
    if (
      isReady &&
      hasUserInteracted &&
      !hasWelcomedThisSession &&
      !hasManuallyTriggered &&
      !isEnabled
    ) {
      toggleEnabled();
    }
  }, [isReady, hasUserInteracted, hasWelcomedThisSession, hasManuallyTriggered, isEnabled, toggleEnabled]);

  // Welcome the user ONLY ONCE per session and only if not manually triggered
  useEffect(() => {
    if (
      isReady && 
      !hasWelcomedThisSession && 
      !hasManuallyTriggered &&
      isEnabled && 
      hasUserInteracted
    ) {
      console.log('🎤 Nelie auto-welcoming user to homepage - ONCE PER SESSION (Unified)');
      setHasWelcomedThisSession(true);
      sessionStorage.setItem('nelieHomepageWelcomed', 'true');
      setTimeout(() => {
        speak(welcomeMessage, true);
      }, 1500);
    }
  }, [isReady, hasWelcomedThisSession, hasManuallyTriggered, isEnabled, hasUserInteracted, userName, speak, welcomeMessage]);

  const handleStopSpeech = () => {
    console.log('🔊 Stopping Nelie speech');
    stop();
  };

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <WelcomeContent userName={userName} />
          <NelieAvatarDisplay 
            isSpeaking={isSpeaking}
            onStopSpeech={handleStopSpeech}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HomepageWelcome;
