
import { useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const speak = useCallback(async (text: string) => {
    console.log('🎵 Nelie attempting to speak:', text.substring(0, 50) + '...');
    
    try {
      // Try ElevenLabs first with the provided API key
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_fee958ec8b6800c05780204da141eb8ae973d4642c37d5dc'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('🎵 ElevenLabs speech completed');
            resolve();
          };
          audio.onerror = () => {
            console.error('Audio playback failed');
            reject(new Error('Audio playback failed'));
          };
          audio.play().catch(reject);
        });
      } else {
        throw new Error(`ElevenLabs API failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Failed to use ElevenLabs, falling back to browser TTS:', error);
      
      // Enhanced fallback to browser speech synthesis
      return new Promise<void>((resolve, reject) => {
        if ('speechSynthesis' in window) {
          // Stop any current speech
          speechSynthesis.cancel();
          
          // Wait a bit for cancellation to complete
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1.2; // Higher pitch for female voice
            utterance.volume = 1.0;
            
            // Try to use a female voice if available
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.map(v => v.name));
            
            const femaleVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female') ||
              voice.name.toLowerCase().includes('woman') ||
              voice.name.toLowerCase().includes('samantha') ||
              voice.name.toLowerCase().includes('karen') ||
              voice.name.toLowerCase().includes('victoria') ||
              voice.name.toLowerCase().includes('zira') ||
              (voice.name.toLowerCase().includes('alex') && voice.lang.includes('en'))
            );
            
            if (femaleVoice) {
              utterance.voice = femaleVoice;
              console.log('🔊 Using voice:', femaleVoice.name);
            } else {
              console.log('🔊 Using default voice');
            }
            
            utterance.onend = () => {
              console.log('🔊 Browser TTS completed');
              resolve();
            };
            
            utterance.onerror = (event) => {
              console.error('Speech synthesis error:', event);
              reject(new Error('Speech synthesis failed'));
            };
            
            speechSynthesis.speak(utterance);
          }, 100);
        } else {
          console.error('Speech synthesis not supported');
          reject(new Error('Speech synthesis not supported'));
        }
      });
    }
  }, []);

  return { speak };
};
