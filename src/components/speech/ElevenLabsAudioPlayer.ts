
export class ElevenLabsAudioPlayer {
  async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("🔊 [ElevenLabsAudioPlayer] Starting audio playback, data length:", base64Audio.length);
        const audioData = `data:audio/mpeg;base64,${base64Audio}`;
        const audio = new Audio(audioData);

        audio.onended = () => {
          console.log("✅ [ElevenLabsAudioPlayer] Audio playback completed successfully");
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error("❌ [ElevenLabsAudioPlayer] Audio playback error:", e);
          reject(new Error("Audio playback failed"));
        };

        audio.onloadstart = () => {
          console.log("🎵 [ElevenLabsAudioPlayer] Audio loading started");
        };

        audio.oncanplay = () => {
          console.log("🎵 [ElevenLabsAudioPlayer] Audio can start playing");
        };

        audio.play().then(() => {
          console.log("🎵 [ElevenLabsAudioPlayer] Audio.play() called successfully");
        }).catch((playError) => {
          console.error("❌ [ElevenLabsAudioPlayer] Audio.play() failed:", playError);
          reject(playError);
        });
      } catch (error) {
        console.error("❌ [ElevenLabsAudioPlayer] Audio setup failed:", error);
        reject(error);
      }
    });
  }
}
