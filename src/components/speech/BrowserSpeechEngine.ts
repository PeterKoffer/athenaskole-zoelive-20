
export const browserSpeechEngine = {
  speak(text: string, config: {rate: number, pitch: number, volume: number, voice?: SpeechSynthesisVoice}, onStart: () => void, onEnd: () => void, onError: (event: any) => void) {
    if (typeof speechSynthesis === 'undefined') {
      onError({error: 'not_supported'});
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    if (config.voice) utterance.voice = config.voice;
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = onError;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    return utterance;
  }
};
