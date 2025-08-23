import { useMemo } from 'react';

// Minimal stub to satisfy useLessonActions expectations
// Provides autoReadEnabled flag and speakWithPersonality method
export type PersonalityContext = 'question' | 'explanation' | 'encouragement' | 'humor';

interface EngineConfig {
  subject: string;
  timeElapsed: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
}

export const useEnhancedTeachingEngine = (_config: EngineConfig) => {
  // You can later wire this to your actual AI speech/teaching engine
  return useMemo(
    () => ({
      autoReadEnabled: true,
      speakWithPersonality: (text: string, context: PersonalityContext) => {
        // Non-blocking no-op: log for now to avoid runtime errors
        console.log(`🗣️ [Engine stub] (${context})`, text);
      },
    }),
    [
      _config.subject,
      _config.timeElapsed,
      _config.correctStreak,
      _config.score,
      _config.lessonStartTime,
    ]
  );
};

export default useEnhancedTeachingEngine;
