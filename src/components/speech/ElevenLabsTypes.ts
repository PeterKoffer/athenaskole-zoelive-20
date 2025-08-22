
export interface ElevenLabsConfig {
  voiceId: string;
  model: string;
}

export interface AudioResponse {
  audioContent: string;
  error?: string;
}

export interface VoiceInfo {
  voice_id: string;
  name: string;
}

export interface VoicesResponse {
  voices: VoiceInfo[];
  error?: string;
}
