import { useEffect, useState } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

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
    enableUserInteraction,
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

  const handleTestSpeech = async () => {
    console.log('🔊 Enable Nelie button clicked (Homepage)', { 
      isEnabled, 
      hasUserInteracted, 
      isSpeaking, 
      isReady 
    });
    
    // Mark that user manually triggered speech to prevent auto-welcome
    setHasManuallyTriggered(true);
    setHasWelcomedThisSession(true);
    sessionStorage.setItem('nelieHomepageWelcomed', 'true');
    
    if (!hasUserInteracted) {
      console.log('🔊 First interaction - enabling user interaction');
      enableUserInteraction();
      setTimeout(() => {
        if (!isEnabled) {
          toggleEnabled();
        }
        setTimeout(() => {
          speak(welcomeMessage, true);
        }, 500);
      }, 200);
      return;
    }
    
    if (isSpeaking) {
      console.log('🔊 Stopping current speech');
      stop();
      return;
    }
    
    if (!isEnabled) {
      console.log('🔊 Enabling speech and will speak welcome message...');
      toggleEnabled();
    }
    
    if (!isReady) {
      console.log('🔊 Waiting for speech system readiness...');
      setTimeout(() => handleTestSpeech(), 600);
      return;
    }
    
    console.log('🔊 Speaking welcome message');
    speak(welcomeMessage, true);
  };

  const getButtonText = () => {
    if (!hasUserInteracted) return 'Enable Nelie';
    if (isSpeaking) return 'Stop Nelie';
    if (!isEnabled) return 'Enable Nelie';
    return 'Test Nelie Voice';
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
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleTestSpeech}
              variant="outline"
              size="sm"
              className={`border-white/20 bg-white hover:bg-gray-100 text-black font-medium ${
                isSpeaking ? 'animate-pulse' : ''
              }`}
            >
              {isEnabled ? (
                <Volume2 className={`w-4 h-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              {getButtonText()}
            </Button>
          </div>
        </div>
        
        {isSpeaking && (
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-200">Nelie is speaking...</span>
          </div>
        )}
        
        {!hasUserInteracted && (
          <div className="mt-4 text-purple-200 text-sm">
            💡 Click "Enable Nelie" to activate the voice system
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HomepageWelcome;
