
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, TestTube, AlertTriangle, Hand } from 'lucide-react';
import { useSimplifiedSpeech } from '@/components/adaptive-learning/hooks/useSimplifiedSpeech';

const SpeechTestCard = () => {
  const { 
    isSpeaking, 
    autoReadEnabled, 
    hasUserInteracted,
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

  const speechSynthesisSupported = typeof speechSynthesis !== 'undefined';
  const voicesCount = speechSynthesisSupported ? speechSynthesis.getVoices().length : 0;

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Nelie Speech System</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="text-slate-950"
            >
              {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {!hasUserInteracted && <Hand className="w-3 h-3 ml-1" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSpeech}
              className="text-slate-950"
            >
              {isSpeaking ? 'Stop Nelie' : 'Test Nelie Voice'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {!hasUserInteracted && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 p-3 rounded">
              <Hand className="w-5 h-5" />
              <div>
                <div className="font-medium">Click to Enable Nelie's Voice</div>
                <div className="text-sm text-yellow-300">
                  Browser security requires user interaction before speech can work
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-300 grid grid-cols-2 gap-4">
            <div>
              <strong>Status:</strong>
              <div className="ml-2">
                • Browser Support: {speechSynthesisSupported ? '✅' : '❌'}<br/>
                • User Interaction: {hasUserInteracted ? '✅' : '❌'}<br/>
                • Speech Ready: {isReady && hasUserInteracted ? '✅' : '❌'}<br/>
                • Currently Speaking: {isSpeaking ? '🔊' : '🔇'}<br/>
                • Auto-Read: {autoReadEnabled ? '✅' : '❌'}
              </div>
            </div>
            <div>
              <strong>Voice Info:</strong>
              <div className="ml-2">
                • Available Voices: {voicesCount}<br/>
                • System: Web Speech API
              </div>
            </div>
          </div>

          {!speechSynthesisSupported && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-2 rounded">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Speech synthesis is not supported in this browser</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechTestCard;
