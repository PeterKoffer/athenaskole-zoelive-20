
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, TestTube, AlertTriangle } from 'lucide-react';
import { useWorkingSpeech } from '@/components/adaptive-learning/hooks/useWorkingSpeech';

const SpeechTestCard = () => {
  const { 
    isSpeaking, 
    autoReadEnabled, 
    isReady, 
    debugInfo,
    speakText, 
    stopSpeaking, 
    toggleMute, 
    testSpeech 
  } = useWorkingSpeech();

  const handleTestSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      testSpeech();
    }
  };

  const handleCustomTest = () => {
    const testMessages = [
      "Hello! This is Nelie testing the speech system. Can you hear me clearly?",
      "I am your AI learning companion. Let's make sure my voice is working perfectly!",
      "Testing, testing, one, two, three! Is my voice coming through loud and clear?"
    ];
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    speakText(randomMessage, true);
  };

  const handleVoicesList = () => {
    if (typeof speechSynthesis !== 'undefined') {
      const voices = speechSynthesis.getVoices();
      console.log('🎵 Available voices:', voices);
      voices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`);
      });
    }
  };

  const speechSynthesisSupported = typeof speechSynthesis !== 'undefined';
  const voicesCount = speechSynthesisSupported ? speechSynthesis.getVoices().length : 0;

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Nelie Speech System Test</span>
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleVoicesList}
              className="text-slate-950"
            >
              List Voices
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-300 grid grid-cols-2 gap-4">
            <div>
              <strong>System Status:</strong>
              <div className="ml-2">
                • Browser Support: {speechSynthesisSupported ? '✅' : '❌'}<br/>
                • Speech Ready: {isReady ? '✅' : '❌'}<br/>
                • Currently Speaking: {isSpeaking ? '🔊' : '🔇'}<br/>
                • Auto-Read Enabled: {autoReadEnabled ? '✅' : '❌'}
              </div>
            </div>
            <div>
              <strong>Voice Info:</strong>
              <div className="ml-2">
                • Available Voices: {voicesCount}<br/>
                • Debug Info: <span className="text-yellow-300">{debugInfo}</span>
              </div>
            </div>
          </div>

          {!speechSynthesisSupported && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Speech synthesis is not supported in this browser</span>
            </div>
          )}

          {speechSynthesisSupported && voicesCount === 0 && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">No voices loaded yet. This may take a moment on first load.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechTestCard;
