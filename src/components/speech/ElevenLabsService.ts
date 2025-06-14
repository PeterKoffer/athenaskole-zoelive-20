
interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model: string;
}

interface AudioResponse {
  audioContent: string;
  error?: string;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isAvailable: boolean = false;

  constructor() {
    this.config = {
      apiKey: 'sk_d4604edcd1d6fd5fdcd107a3c28b796927864370ded00c7',
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria - young, friendly female voice perfect for Nelie
      model: 'eleven_turbo_v2_5' // Low latency, high quality
    };
    
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      // Test if we can reach ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });
      
      this.isAvailable = response.ok;
      console.log('🎤 ElevenLabs availability:', this.isAvailable ? 'Available' : 'Unavailable');
    } catch (error) {
      console.log('🎤 ElevenLabs not available, will use browser speech synthesis');
      this.isAvailable = false;
    }
  }

  async generateSpeech(text: string): Promise<AudioResponse> {
    if (!this.isAvailable) {
      return { audioContent: '', error: 'ElevenLabs not available' };
    }

    try {
      console.log('🎤 Generating ElevenLabs speech for:', text.substring(0, 50) + '...');
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + this.config.voiceId, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: this.config.model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail?.message || 'Unknown error'}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(audioBuffer))
      );

      return { audioContent: base64Audio };
    } catch (error) {
      console.error('❌ ElevenLabs speech generation failed:', error);
      return { 
        audioContent: '', 
        error: error instanceof Error ? error.message : 'Speech generation failed' 
      };
    }
  }

  async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audioData = `data:audio/mpeg;base64,${base64Audio}`;
        const audio = new Audio(audioData);
        
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  setVoice(voiceId: string): void {
    this.config.voiceId = voiceId;
  }
}

export const elevenLabsService = new ElevenLabsService();
