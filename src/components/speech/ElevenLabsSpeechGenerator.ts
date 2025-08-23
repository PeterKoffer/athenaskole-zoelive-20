
import { invokeFn } from "@/supabase/safeInvoke";
import { AudioResponse, ElevenLabsConfig } from "./ElevenLabsTypes";

export class ElevenLabsSpeechGenerator {
  async generateSpeech(text: string, config: ElevenLabsConfig): Promise<AudioResponse> {
    console.log("🎤 [ElevenLabsSpeechGenerator] Starting TTS generation for text:", text.substring(0, 50) + "...");
    
    try {
      console.log("🌐 [ElevenLabsSpeechGenerator] Using secure TTS proxy...");
      
      const data = await invokeFn<{ audioContent?: string; error?: string }>('tts-proxy', {
        text,
        voiceId: config.voiceId
      });

      if (data?.audioContent) {
        console.log("✅ [ElevenLabsSpeechGenerator] TTS proxy SUCCESS!");
        return { audioContent: data.audioContent };
      }
      
      console.error("❌ [ElevenLabsSpeechGenerator] TTS proxy returned no audio content");
      return { audioContent: "", error: "No audio content received" };
      
    } catch (error: any) {
      console.error("❌ [ElevenLabsSpeechGenerator] TTS proxy error:", error);
      return { audioContent: "", error: `TTS service error: ${error.message}` };
    }
  }

}
