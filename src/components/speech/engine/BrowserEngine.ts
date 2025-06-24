
import { SpeechConfig } from '../SpeechConfig';
import { useFemaleVoiceSelection } from '../../adaptive-learning/hooks/useFemaleVoiceSelection';

export const browserSpeakFallback = ({
  text,
  config,
  updateState,
  onDone,
}: {
  text: string;
  config: SpeechConfig;
  updateState: (updates: any) => void;
  onDone: () => void;
}) => {
  console.log("[BrowserEngine] Invoking browser fallback speech engine.");
  
  if (typeof speechSynthesis === 'undefined') {
    console.error("[BrowserEngine] Speech synthesis not supported");
    updateState({ isSpeaking: false, lastError: "Speech not supported" });
    onDone();
    return;
  }

  // Cancel any existing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure for Nelie's personality - female voice settings
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1.15; // Slightly higher pitch for female voice
  utterance.volume = 1.0;

  // Get female voice
  const getFemaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.warn('⚠️ No voices available yet, will use default');
      return null;
    }
    
    // Priority list for female voices
    const femaleVoiceNames = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira Desktop',
      'Microsoft Zira',
      'Karen',
      'Samantha',
      'Victoria',
      'Allison',
      'Susan',
      'Fiona',
      'Moira',
      'Tessa'
    ];

    // First try to find preferred female voices
    for (const voiceName of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) {
        console.log('🎵 Selected preferred female voice:', voice.name);
        return voice;
      }
    }

    // Fallback: look for any voice with "female" in the name
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman'))
    );
    
    if (femaleVoice) {
      console.log('🎵 Using fallback female voice:', femaleVoice.name);
      return femaleVoice;
    }

    // Last resort - filter out known male voices and pick the first remaining English voice
    const maleVoiceNames = ['male', 'david', 'mark', 'daniel', 'google uk english male', 'google us english male'];
    const nonMaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      !maleVoiceNames.some(maleName => voice.name.toLowerCase().includes(maleName))
    );

    if (nonMaleVoice) {
      console.log('🎵 Using non-male English voice:', nonMaleVoice.name);
      return nonMaleVoice;
    }

    // Absolute fallback
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using first English voice (may be male):', englishVoice.name);
      return englishVoice;
    }

    return null;
  };

  const voice = getFemaleVoice();
  if (voice) {
    utterance.voice = voice;
    console.log('🎭 Nelie will speak with voice:', voice.name);
  } else {
    console.warn('⚠️ No suitable female voice found, using system default');
  }

  utterance.onstart = () => {
    console.log('✅ Nelie (browser fallback) STARTED speaking');
    updateState({ isSpeaking: true, lastError: null });
  };

  utterance.onend = () => {
    console.log('🏁 Nelie (browser fallback) FINISHED speaking');
    updateState({ isSpeaking: false });
    onDone();
  };

  utterance.onerror = (event) => {
    console.error('🚫 Nelie speech error:', event.error, event);
    updateState({ 
      isSpeaking: false, 
      lastError: `Speech error: ${event.error}` 
    });
    onDone();
  };

  // Start speaking
  try {
    console.log('🚀 Nelie starting browser speech:', text.substring(0, 50) + '...');
    speechSynthesis.speak(utterance);
    
    // Backup check to ensure speech started
    setTimeout(() => {
      if (!speechSynthesis.speaking) {
        console.warn('⚠️ Speech may not have started, checking status...');
        if (utterance.voice) {
          console.log('🔄 Retrying speech with selected voice');
          speechSynthesis.speak(utterance);
        }
      }
    }, 100);
  } catch (error) {
    console.error('🚫 Error starting browser speech:', error);
    updateState({ 
      isSpeaking: false, 
      lastError: `Failed to start speech: ${error}` 
    });
    onDone();
  }
};
