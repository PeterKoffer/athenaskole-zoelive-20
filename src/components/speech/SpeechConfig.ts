
// Speech Configuration for Nelie's Voice System
export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
  preferElevenLabs: boolean;
  useElevenLabs: boolean;
}

export function getDefaultSpeechConfig(): SpeechConfig {
  return {
    rate: 0.85,
    pitch: 1.15,
    volume: 1.0,
    preferElevenLabs: true,  // Always prefer ElevenLabs for Nelie
    useElevenLabs: true,     // Enable ElevenLabs by default
  };
}

export function selectOptimalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  console.log('🎵 Selecting optimal female voice for Nelie from', voices.length, 'available voices');
  
  if (voices.length === 0) {
    console.warn('⚠️ No voices available for selection');
    return null;
  }
  
  // Priority list for female voices (Nelie's personality)
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
      console.log('🎭 Selected preferred female voice for Nelie:', voice.name);
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
    console.log('🎭 Using fallback female voice for Nelie:', femaleVoice.name);
    return femaleVoice;
  }

  // Last resort - filter out known male voices and pick the first remaining English voice
  const maleVoiceNames = ['male', 'david', 'mark', 'daniel', 'google uk english male', 'google us english male'];
  const nonMaleVoice = voices.find(voice => 
    voice.lang.startsWith('en') && 
    !maleVoiceNames.some(maleName => voice.name.toLowerCase().includes(maleName))
  );

  if (nonMaleVoice) {
    console.log('🎭 Using non-male English voice for Nelie:', nonMaleVoice.name);
    return nonMaleVoice;
  }

  // Absolute fallback
  const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
  if (englishVoice) {
    console.log('🎭 Using first English voice for Nelie (may be male):', englishVoice.name);
    return englishVoice;
  }

  console.warn('⚠️ No suitable voice found for Nelie, using system default');
  return voices[0] || null;
}
