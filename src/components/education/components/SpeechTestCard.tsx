
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, TestTube } from 'lucide-react';
import { useSimplifiedSpeech } from '@/components/adaptive-learning/hooks/useSimplifiedSpeech';

const SpeechTestCard = () => {
  const { 
    isSpeaking, 
    autoReadEnabled, 
    isReady, 
    speakText, 
    stopSpeaking, 
    toggleMute, 
    testSpeech 
  } = useSimplifiedSpeech();

  const handleTestSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      testSpeech();
    }
  };

  const handleCustomTest = () => {
    const testMessages = [
      "Hello! This is Nelie testing the speech system.",
      "I am your AI learning companion. Can you hear me clearly?",
      "Let's make sure the audio is working perfectly!"
    ];
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    speakText(randomMessage, true);
  };

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Speech System Test</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="text-slate-950"
            >
              {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSpeech}
              className="text-slate-950"
              disabled={!isReady}
            >
              {isSpeaking ? 'Stop Test' : 'Test Speech'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomTest}
              className="text-slate-950"
              disabled={!isReady || !autoReadEnabled}
            >
              Custom Test
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-400">
          Status: Ready: {isReady ? '✅' : '❌'} | 
          Muted: {autoReadEnabled ? '❌' : '✅'} | 
          Speaking: {isSpeaking ? '🔊' : '🔇'} |
          Voices: {typeof speechSynthesis !== 'undefined' ? speechSynthesis.getVoices().length : 0}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechTestCard;
