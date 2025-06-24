
import { SpeechConfig } from './SpeechConfig';
import { SpeechState } from './SpeechState';
import { ElevenLabsEngine } from './engine/ElevenLabsEngine';

export async function speakWithEngines(
  text: string,
  useElevenLabs: boolean,
  config: SpeechConfig,
  updateState: (updates: Partial<SpeechState>) => void,
  onComplete: () => void,
  preferElevenLabs: boolean = true
): Promise<void> {
  console.log('🎤 [SpeechEngines] Starting speech with engines:', {
    text: text.substring(0, 50),
    useElevenLabs,
    preferElevenLabs
  });

  updateState({ isSpeaking: true, currentUtterance: text });

  // Always try ElevenLabs first if enabled and preferred
  if (useElevenLabs && preferElevenLabs) {
    console.log('🎤 [SpeechEngines] Attempting ElevenLabs...');
    
    try {
      const isAvailable = await ElevenLabsEngine.isAvailable();
      console.log('🎤 [SpeechEngines] ElevenLabs availability:', isAvailable);
      
      if (isAvailable) {
        console.log('✅ [SpeechEngines] Using ElevenLabs engine');
        updateState({ usingElevenLabs: true });
        
        await ElevenLabsEngine.speak(text);
        onComplete();
        return; // Success - don't fall back to browser
      } else {
        console.warn('⚠️ [SpeechEngines] ElevenLabs not available, falling back to browser');
      }
    } catch (error) {
      console.error('❌ [SpeechEngines] ElevenLabs failed:', error);
    }
  }

  // Fallback to browser speech synthesis
  console.log('🔄 [SpeechEngines] Using browser speech synthesis fallback');
  updateState({ usingElevenLabs: false });
  
  try {
    if (!window.speechSynthesis) {
      throw new Error('Speech synthesis not supported');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    
    if (config.voice) {
      utterance.voice = config.voice;
    }

    utterance.onend = () => {
      console.log('🏁 [SpeechEngines] Browser speech completed');
      onComplete();
    };

    utterance.onerror = (error) => {
      console.error('❌ [SpeechEngines] Browser speech error:', error);
      updateState({ 
        isSpeaking: false, 
        lastError: 'Browser speech failed' 
      });
    };

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('❌ [SpeechEngines] Browser speech synthesis failed:', error);
    updateState({ 
      isSpeaking: false, 
      lastError: error instanceof Error ? error.message : 'Speech failed' 
    });
  }
}
