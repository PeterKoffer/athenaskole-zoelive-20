
import { SpeechSynthesisVoice } from "./UnifiedSpeechSystem";

export interface SpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
  preferElevenLabs: boolean;
}

export function getDefaultSpeechConfig(): SpeechConfig {
  return {
    rate: 0.8,
    pitch: 1.1,
    volume: 0.85,
    preferElevenLabs: true,
  };
}

export function selectOptimalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const preferredVoices = [
    "Google US English Female",
    "Microsoft Zira Desktop",
    "Karen",
    "Samantha",
    "Victoria",
  ];

  for (const preferred of preferredVoices) {
    const voice = voices.find(
      (v) => v.name.includes(preferred) && v.lang.startsWith("en")
    );
    if (voice) return voice;
  }

  return (
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("woman"))
    ) ||
    voices.find((v) => v.lang.startsWith("en"))
  );
}
