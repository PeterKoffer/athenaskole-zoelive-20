
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
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    speakAsNelie,
    stop,
    toggleEnabled,
    enableUserInteraction
  } = useUnifiedSpeech();

  // Welcome the user ONLY ONCE per session
  useEffect(() => {
    if (isReady && !hasWelcomedThisSession && isEnabled && hasUserInteracted) {
      console.log('🎤 Nelie welcoming user to homepage - ONCE PER SESSION');
      
      // Mark as welcomed for this session
      setHasWelcomedThisSession(true);
      sessionStorage.setItem('nelieHomepageWelcomed', 'true');
      
      const welcomeMessage = `Hello ${userName}! Welcome back to your learning platform! I'm Nelie, your AI learning companion, and I'm so excited to help you learn today! Click on any subject to start your learning adventure with me!`;
      
      // Small delay to ensure speech system is ready
      setTimeout(() => {
        speakAsNelie(welcomeMessage, true);
      }, 1500);
    }
  }, [isReady, hasWelcomedThisSession, isEnabled, hasUserInteracted, userName, speakAsNelie]);

  const handleTestSpeech = () => {
    console.log('🔊 Enable Nelie button clicked', { isEnabled, hasUserInteracted, isSpeaking });
    
    if (!hasUserInteracted) {
      console.log('🔊 Enabling user interaction first');
      enableUserInteraction();
      // Force enable speech after interaction
      if (!isEnabled) {
        setTimeout(() => {
          toggleEnabled();
        }, 100);
      }
    } else if (isSpeaking) {
      console.log('🔊 Stopping current speech');
      stop();
    } else if (!isEnabled) {
      console.log('🔊 Enabling speech');
      toggleEnabled();
    } else {
      console.log('🔊 Testing speech');
      const testMessage = `Hi ${userName}! This is Nelie speaking. I'm ready to help you learn today!`;
      speakAsNelie(testMessage, true);
    }
  };

  const getButtonText = () => {
    if (!hasUserInteracted) return 'Enable Nelie';
    if (isSpeaking) return 'Speaking...';
    if (!isEnabled) return 'Enable Nelie';
    return 'Nelie Voice';
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
      </CardContent>
    </Card>
  );
};

export default HomepageWelcome;
