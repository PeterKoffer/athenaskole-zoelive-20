
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, TestTube, AlertTriangle, Hand, CheckCircle, Info, RefreshCw, Zap } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

const SpeechTestCard = () => {
  const { 
    isSpeaking, 
    isEnabled, 
    hasUserInteracted,
    isReady, 
    lastError,
    isLoading,
    test, 
    stop, 
    toggleEnabled
  } = useUnifiedSpeech();

  const handleTestSpeech = () => {
    console.log('🧪 Test button clicked - isSpeaking:', isSpeaking);
    if (isSpeaking) {
      stop();
    } else {
      test();
    }
  };

  const speechSynthesisSupported = typeof speechSynthesis !== 'undefined';
  const voicesCount = speechSynthesisSupported ? speechSynthesis.getVoices().length : 0;
  
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };
  
  const browser = getBrowserInfo();

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Nelie Enhanced Speech - ElevenLabs Integration</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEnabled}
              className="text-slate-950"
            >
              {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {!hasUserInteracted && <Hand className="w-3 h-3 ml-1" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSpeech}
              className="text-slate-950"
              disabled={!isReady}
            >
              {isSpeaking ? 'Stop Nelie' : 'Test Enhanced Voice'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {lastError && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <div className="font-medium">Speech Error</div>
                <div className="text-sm text-red-300">{lastError}</div>
              </div>
            </div>
          )}

          {!hasUserInteracted && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 p-3 rounded">
              <Hand className="w-5 h-5" />
              <div>
                <div className="font-medium">Click "Test Enhanced Voice" to Enable Speech</div>
                <div className="text-sm text-yellow-300">
                  Browser security requires user interaction before speech can work.
                  This unlocks both ElevenLabs and browser speech capabilities.
                </div>
              </div>
            </div>
          )}

          {isLoading && hasUserInteracted && (
            <div className="flex items-center space-x-2 text-blue-400 bg-blue-900/20 p-3 rounded">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div>
                <div className="font-medium">Initializing Enhanced Speech System...</div>
                <div className="text-sm text-blue-300">
                  Connecting to ElevenLabs for premium voice quality...
                </div>
              </div>
            </div>
          )}

          {hasUserInteracted && isEnabled && isReady && !lastError && (
            <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded">
              <CheckCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">🎉 Nelie's Enhanced Voice System Active!</div>
                <div className="text-sm text-green-300">
                  ElevenLabs integration ready with premium voice quality.
                  Fallback to browser speech ({voicesCount} voices) if needed.
                </div>
              </div>
            </div>
          )}

          {hasUserInteracted && !isEnabled && (
            <div className="flex items-center space-x-2 text-blue-400 bg-blue-900/20 p-3 rounded">
              <Info className="w-5 h-5" />
              <div>
                <div className="font-medium">Speech is Disabled</div>
                <div className="text-sm text-blue-300">
                  Click the volume button to re-enable Nelie's enhanced voice system.
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-300 grid grid-cols-2 gap-4">
            <div>
              <strong>Primary System:</strong>
              <div className="ml-2">
                • ElevenLabs: ✅ Integrated<br/>
                • Voice: Aria (Premium Quality)<br/>
                • Model: Turbo v2.5 (Low Latency)<br/>
                • User Interaction: {hasUserInteracted ? '✅' : '⏳'}<br/>
                • Currently Speaking: {isSpeaking ? '🔊' : '🔇'}
              </div>
            </div>
            <div>
              <strong>Fallback System:</strong>
              <div className="ml-2">
                • Browser: {browser} {speechSynthesisSupported ? '✅' : '❌'}<br/>
                • Available Voices: {voicesCount}<br/>
                • Speech Enabled: {isEnabled ? '✅' : '🔇'}<br/>
                • System Ready: {isReady ? '✅' : '⏳'}<br/>
                • Version: ElevenLabs Enhanced v2.0
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-purple-400 bg-purple-900/20 p-2 rounded">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">
              🎭 Enhanced Features: Premium voice quality, natural intonation, reduced latency, intelligent fallback system
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechTestCard;
