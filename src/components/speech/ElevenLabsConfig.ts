
export const EDGE_BASE =
  "https://tgjudtnjhtumrfthegis.functions.supabase.co/elevenlabs-proxy";

// Fena - Character: BlgEcC0TfWpBak7FmvHW (Official ElevenLabs voice - FEMALE CHARACTER)
// This is the ONLY voice that should be used throughout the entire application
export const FENA_VOICE_ID = "BlgEcC0TfWpBak7FmvHW";
export const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";

export const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.5,
  style: 0.3,
  use_speaker_boost: true,
};

console.log('🎭 ElevenLabs Config: Using secure TTS proxy for Fena voice');
