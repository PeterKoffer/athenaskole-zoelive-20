
import { useEffect, useState } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VolumeX } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

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
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-purple-100">
              Ready to continue your amazing learning journey? Choose a subject below to get started!
            </p>
          </div>
          
          {/* Nelie Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <RobotAvatar 
              size="xl" 
              isActive={true} 
              isSpeaking={isSpeaking}
              className="drop-shadow-lg"
            />
            
            {/* Stop button when speaking */}
            {isSpeaking && (
              <Button
                onClick={handleStopSpeech}
                variant="outline"
                className="border-white/20 bg-red-500 hover:bg-red-600 text-white font-medium animate-pulse"
              >
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Nelie
              </Button>
            )}
            
            {/* Status indicator */}
            {isSpeaking && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-medium">Nelie is speaking...</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomepageWelcome;
