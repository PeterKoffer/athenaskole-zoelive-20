
import { useCallback } from "react";

export const useAudioPlayer = (currentLanguageCode: string) => {
  const playAudio = useCallback((text: string, langCode: string = currentLanguageCode) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: { [key: string]: string } = {
        en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', zh: 'zh-CN', da: 'da-DK', pt: 'pt-PT'
      };
      utterance.lang = langMap[langCode] || 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else if (text) {
      console.log(`Playing audio file: ${text}`);
    }
  }, [currentLanguageCode]);

  return { playAudio };
};
