
import { useEffect, useState } from 'react';
import { useWorkingNelieSpeech } from '@/components/adaptive-learning/hooks/useWorkingNelieSpeech';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface HomepageWelcomeProps {
  userName: string;
}

const HomepageWelcome = ({ userName }: HomepageWelcomeProps) => {
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute
  } = useWorkingNelieSpeech();

  const welcomeMessages = [
    `Hello ${userName}! Welcome back to your learning platform!`,
    "I'm Nelie, your AI learning companion.",
    "I'm so excited to help you learn today!",
    "Click on any subject to start your learning adventure with me!"
  ];

  // Welcome the user once when they arrive and speech is ready
  useEffect(() => {
    if (isReady && !hasWelcomed && autoReadEnabled && hasUserInteracted) {
      console.log('🎤 Nelie welcoming user to homepage');
      setHasWelcomed(true);
      
      const fullWelcomeMessage = welcomeMessages.join(' ');
      
      setTimeout(() => {
        speakText(fullWelcomeMessage, true);
      }, 1000);
    }
  }, [isReady, hasWelcomed, autoReadEnabled, hasUserInteracted, userName, speakText]);

  // Cycle through welcome messages with proper timing for speech
  useEffect(() => {
    if (hasWelcomed) {
      const timer = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % welcomeMessages.length);
      }, 4000); // Increased to 4 seconds to give Nelie time to read

      return () => clearInterval(timer);
    }
  }, [hasWelcomed, welcomeMessages.length]);

  const handleTestSpeech = () => {
    if (!hasUserInteracted) {
      // This will trigger user interaction and enable speech
      toggleMute();
    } else if (isSpeaking) {
      stopSpeaking();
    } else {
      const testMessage = `Hi ${userName}! This is Nelie speaking. I'm ready to help you learn today!`;
      speakText(testMessage, true);
    }
  };

  const currentMessage = hasWelcomed ? welcomeMessages[currentMessageIndex] : `Hello ${userName}! 🎓`;

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {hasWelcomed ? `Welcome back, ${userName}! 👋` : `Hello ${userName}! 🎓`}
            </h2>
            <p className="text-purple-100 min-h-[1.5rem]">
              {hasWelcomed 
                ? currentMessage
                : "Click the voice button to let Nelie welcome you!"
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleTestSpeech}
              variant="outline"
              size="sm"
              className={`border-white/20 text-white hover:bg-white/10 ${
                isSpeaking ? 'animate-pulse bg-white/20' : ''
              }`}
            >
              {autoReadEnabled ? (
                <Volume2 className={`w-4 h-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
              ) : (
                <VolumeX className="w-4 h-4 mr-2" />
              )}
              {isSpeaking ? 'Speaking...' : autoReadEnabled ? 'Nelie Voice' : 'Enable Nelie'}
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
