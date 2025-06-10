
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, TestTube, AlertTriangle, Hand, CheckCircle, Info, RefreshCw } from 'lucide-react';
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
  
  // Browser compatibility detection
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };
  
  const browser = getBrowserInfo();
  const isChrome = browser === 'Chrome';
  const isFirefox = browser === 'Firefox';
  const isSafari = browser === 'Safari';

  return (
    <Card className="bg-gray-800 border-gray-600 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">Nelie Speech System - UNIFIED VERSION</span>
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
              disabled={!speechSynthesisSupported}
            >
              {isSpeaking ? 'Stop Nelie' : 'Test Nelie Voice'}
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

          {!speechSynthesisSupported && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <div className="font-medium">Speech Not Supported</div>
                <div className="text-sm text-red-300">
                  Your browser ({browser}) doesn't support speech synthesis or it's disabled.
                  {!isChrome && " Try using Chrome or Edge for better speech support."}
                </div>
              </div>
            </div>
          )}

          {speechSynthesisSupported && !hasUserInteracted && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 p-3 rounded">
              <Hand className="w-5 h-5" />
              <div>
                <div className="font-medium">Click "Test Nelie Voice" to Enable Speech</div>
                <div className="text-sm text-yellow-300">
                  Browser security requires user interaction before speech can work.
                  This is required for all speech features to function properly.
                </div>
              </div>
            </div>
          )}

          {speechSynthesisSupported && isLoading && hasUserInteracted && (
            <div className="flex items-center space-x-2 text-blue-400 bg-blue-900/20 p-3 rounded">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div>
                <div className="font-medium">Loading Speech System...</div>
                <div className="text-sm text-blue-300">
                  Please wait while speech voices are being loaded.
                  {isSafari && " Safari may take longer to load voices."}
                </div>
              </div>
            </div>
          )}

          {speechSynthesisSupported && voicesCount === 0 && hasUserInteracted && !isLoading && (
            <div className="flex items-center space-x-2 text-orange-400 bg-orange-900/20 p-3 rounded">
              <RefreshCw className="w-5 h-5" />
              <div>
                <div className="font-medium">No Voices Available</div>
                <div className="text-sm text-orange-300">
                  Speech voices failed to load. Try refreshing the page or check browser settings.
                  {isSafari && " Safari may require additional permissions for speech."}
                </div>
              </div>
            </div>
          )}

          {hasUserInteracted && isEnabled && speechSynthesisSupported && voicesCount > 0 && !lastError && (
            <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded">
              <CheckCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">Nelie's Unified Voice is Active!</div>
                <div className="text-sm text-green-300">
                  Speech system ready with {voicesCount} available voices. 
                  Unified speech system provides consistent experience across all components.
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
                  Click the volume button to re-enable Nelie's voice. 
                  You can mute/unmute speech at any time.
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-300 grid grid-cols-2 gap-4">
            <div>
              <strong>Status:</strong>
              <div className="ml-2">
                • Browser: {browser} {speechSynthesisSupported ? '✅' : '❌'}<br/>
                • User Interaction: {hasUserInteracted ? '✅' : '⏳'}<br/>
                • Speech Ready: {isReady && hasUserInteracted ? '✅' : '⏳'}<br/>
                • Currently Speaking: {isSpeaking ? '🔊' : '🔇'}<br/>
                • Speech Enabled: {isEnabled ? '✅' : '🔇'}
              </div>
            </div>
            <div>
              <strong>System Info:</strong>
              <div className="ml-2">
                • Available Voices: {voicesCount}{voicesCount === 0 && speechSynthesisSupported ? ' (loading...)' : ''}<br/>
                • System: Unified Speech API<br/>
                • Version: UNIFIED v1.2<br/>
                • Queue: {hasUserInteracted ? 'Active' : 'Waiting for interaction'}<br/>
                • Browser Rating: {isChrome ? 'Excellent' : isFirefox ? 'Good' : isSafari ? 'Limited' : 'Unknown'}
              </div>
            </div>
          </div>

          {speechSynthesisSupported && (isSafari || browser === 'Unknown') && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-900/20 p-2 rounded">
              <Info className="w-4 h-4" />
              <span className="text-sm">
                {isSafari ? 'Safari has limited speech support. For best experience, use Chrome or Edge.' : 
                 'Unknown browser. Speech may not work reliably. Try Chrome or Edge for best support.'}
              </span>
            </div>
          )}

          {!speechSynthesisSupported && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Troubleshooting Steps:</span>
              </div>
              <div className="text-sm text-gray-300 ml-6 space-y-1">
                <div>1. Try refreshing the page</div>
                <div>2. Check if sound is enabled in browser settings</div>
                <div>3. Use Chrome, Edge, or Firefox for best support</div>
                <div>4. Ensure microphone permissions are granted</div>
                <div>5. Try in an incognito/private window</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechTestCard;
