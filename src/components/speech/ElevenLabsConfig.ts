
export const EDGE_BASE =
  "https://tgjudtnjhtumrfthegis.functions.supabase.co/elevenlabs-proxy";

// Fena - Character: BlgEcC0TfWpBak7FmvHW (Official ElevenLabs voice - FEMALE CHARACTER)
// This is the ONLY voice that should be used throughout the entire application
export const FENA_VOICE_ID = "BlgEcC0TfWpBak7FmvHW";
export const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";

// Use the provided API key directly
export const ELEVENLABS_API_KEY = "sk_37e2751a30d9fcb1c276898281def78f92a285a2223b1b51";

export const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.5,
  style: 0.3,
  use_speaker_boost: true,
};

console.log('🎭 ElevenLabs Config: Using hardcoded API key for Fena voice');
