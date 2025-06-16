
import { useCallback } from 'react';

export const useFemaleVoiceSelection = () => {
  const getFemaleVoice = useCallback(() => {
    if (typeof speechSynthesis === 'undefined') return null;
    
    const voices = speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.warn('⚠️ No voices available yet');
      return null;
    }
    
    // Priority list for female voices
    const femaleVoiceNames = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira',
      'Karen',
      'Samantha',
      'Victoria',
      'Allison',
      'Susan'
    ];

    // First try to find preferred female voices
    for (const voiceName of femaleVoiceNames) {
      const voice = voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) {
        console.log('🎵 Selected preferred voice:', voice.name);
        return voice;
      }
    }

    // Fallback to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) {
      console.log('🎵 Using fallback English voice:', englishVoice.name);
      return englishVoice;
    }

    // Last resort - use first available voice
    const firstVoice = voices[0];
    if (firstVoice) {
      console.log('🎵 Using first available voice:', firstVoice.name);
      return firstVoice;
    }

    return null;
  }, []);

  return { getFemaleVoice };
};
