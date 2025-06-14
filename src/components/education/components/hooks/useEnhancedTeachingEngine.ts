
import { useState, useEffect, useCallback } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { LessonActivity } from '../types/LessonTypes';

interface TeachingEngineConfig {
  subject: string;
  timeElapsed: number;
  correctStreak: number;
  score: number;
  lessonStartTime: number;
}

export const useEnhancedTeachingEngine = (config: TeachingEngineConfig) => {
  const [studentProgress, setStudentProgress] = useState(0);
  const [engagementLevel, setEngagementLevel] = useState(75);
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(0.85);
  const [humorLevel, setHumorLevel] = useState(3);
  
  const {
    isSpeaking,
    isEnabled: autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakAsNelie,
    stop: stopSpeaking,
    toggleEnabled: handleMuteToggle
  } = useUnifiedSpeech();

  // Enhanced speech with Fena voice ONLY - no browser fallback
  const speakWithPersonality = useCallback((text: string, context: 'explanation' | 'question' | 'encouragement' | 'humor' = 'explanation') => {
    if (!autoReadEnabled || !hasUserInteracted) {
      console.log('🔇 Speech disabled or no user interaction');
      return;
    }

    // Add personality modifiers based on context
    let enhancedText = text;
    
    switch (context) {
      case 'explanation':
        enhancedText = `Let me share this with you: ${text}`;
        break;
      case 'question':
        enhancedText = `Here's your question. Take your time to think: ${text}`;
        break;
      case 'encouragement':
        enhancedText = `${text} Keep up the great work!`;
        break;
      case 'humor':
        const gentleIntros = [
          "Here's something interesting:",
          "Let me tell you about this:",
          "This is pretty cool:",
          "Here's what we're going to explore:"
        ];
        enhancedText = `${gentleIntros[Math.floor(Math.random() * gentleIntros.length)]} ${text}`;
        break;
    }

    // ALWAYS use ElevenLabs Fena voice through UnifiedSpeech - never browser fallback
    console.log('🎭 Using ONLY Fena voice for:', enhancedText.substring(0, 50));
    speakAsNelie(enhancedText, true);
  }, [autoReadEnabled, hasUserInteracted, speakAsNelie]);

  // Adaptive learning speed based on student performance
  const adjustTeachingSpeed = useCallback((correct: boolean, responseTime: number) => {
    if (correct && responseTime < 8000) {
      setAdaptiveSpeed(prev => Math.min(prev + 0.05, 1.0));
      setEngagementLevel(prev => Math.min(prev + 3, 100));
    } else if (!correct || responseTime > 25000) {
      setAdaptiveSpeed(prev => Math.max(prev - 0.05, 0.7));
      setEngagementLevel(prev => Math.max(prev - 2, 20));
    }
  }, []);

  // Generate encouraging responses using only Fena voice
  const generateEncouragement = useCallback((isCorrect: boolean, streak: number) => {
    if (isCorrect) {
      const celebrations = [
        "Excellent work! You're really understanding this.",
        "That's absolutely right! You're doing great.",
        "Perfect! Your thinking is spot on.",
        "Wonderful! You've got this concept down.",
        "Outstanding! You're making great progress.",
        "Fantastic! That shows real understanding.",
        "Brilliant thinking! You're learning so well."
      ];
      
      if (streak >= 3) {
        return `Amazing! ${streak} correct answers in a row! ${celebrations[Math.floor(Math.random() * celebrations.length)]}`;
      }
      
      return celebrations[Math.floor(Math.random() * celebrations.length)];
    } else {
      const encouragements = [
        "That's okay! Learning takes time, and you're doing great.",
        "No worries at all! Every mistake helps us learn better.",
        "Don't worry about it! Let's think through this together.",
        "That's perfectly fine! Learning is all about practicing.",
        "No problem! Everyone learns at their own pace.",
        "It's all good! Let's explore this concept a bit more."
      ];
      
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
  }, []);

  // Enhanced activity content with longer durations and clearer instructions
  const enhanceActivityContent = useCallback((activity: LessonActivity) => {
    const enhanced = { ...activity };
    
    // Increase duration for better pacing (minimum 3 minutes per activity)
    enhanced.duration = Math.max(activity.duration * 1.5, 180);
    
    // Add patience-focused elements to content
    if (activity.phase === 'content-delivery') {
      const patientElements = [
        "Let's take our time to understand:",
        "Here's what we need to know:",
        "Let me explain this clearly:",
        "Take a moment to think about this:",
        "Here's an important concept:"
      ];
      
      const randomElement = patientElements[Math.floor(Math.random() * patientElements.length)];
      if (enhanced.content.segments?.[0]?.explanation) {
        enhanced.content.segments[0].explanation = `${randomElement} ${activity.content.segments[0].explanation}`;
      } else if (enhanced.content.text) {
        enhanced.content.text = `${randomElement} ${activity.content.text}`;
      }
    }
    
    return enhanced;
  }, []);

  return {
    speakWithPersonality,
    adjustTeachingSpeed,
    generateEncouragement,
    enhanceActivityContent,
    adaptiveSpeed,
    engagementLevel,
    studentProgress,
    humorLevel,
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    toggleMute: handleMuteToggle,
    stopSpeaking
  };
};
