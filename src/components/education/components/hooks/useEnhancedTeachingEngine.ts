
import { useState, useEffect, useCallback } from 'react';
import { useWorkingNelieSpeech } from '@/components/adaptive-learning/hooks/useWorkingNelieSpeech';
import { LessonActivity } from '../types/LessonTypes';

interface TeachingEngineConfig {
  subject: string;
  difficulty: number;
  studentEngagement: number;
  learningSpeed: 'fast' | 'normal' | 'adaptive';
}

export const useEnhancedTeachingEngine = (config: TeachingEngineConfig) => {
  const [studentProgress, setStudentProgress] = useState(0);
  const [engagementLevel, setEngagementLevel] = useState(75);
  const [adaptiveSpeed, setAdaptiveSpeed] = useState(1.4); // 40% faster than normal
  const [humorLevel, setHumorLevel] = useState(3); // Scale 1-5
  
  const {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute
  } = useWorkingNelieSpeech();

  // Enhanced speech with personality and humor
  const speakWithPersonality = useCallback((text: string, context: 'explanation' | 'question' | 'encouragement' | 'humor') => {
    if (!autoReadEnabled || !hasUserInteracted) return;

    // Add personality modifiers based on context
    let enhancedText = text;
    
    switch (context) {
      case 'explanation':
        enhancedText = `Let me share something super cool with you! ${text}`;
        break;
      case 'question':
        enhancedText = `Here's an exciting brain teaser for you! ${text}`;
        break;
      case 'encouragement':
        enhancedText = `${text} You're absolutely brilliant at this!`;
        break;
      case 'humor':
        const funnyIntros = [
          "Here's a fun fact that might blow your mind:",
          "Get ready for something awesome:",
          "This is so cool, I can hardly contain my excitement:",
          "Wait until you hear this amazing thing:"
        ];
        enhancedText = `${funnyIntros[Math.floor(Math.random() * funnyIntros.length)]} ${text}`;
        break;
    }

    // Use faster speech synthesis with enhanced personality
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(enhancedText);
      utterance.rate = adaptiveSpeed; // Dynamic speed based on engagement
      utterance.pitch = 1.2; // Higher pitch for Nelie's enthusiastic personality
      utterance.volume = 0.9;
      
      // Try to use a more expressive voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') || 
        voice.name.includes('Microsoft Zira') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, [autoReadEnabled, hasUserInteracted, adaptiveSpeed]);

  // Adaptive learning speed based on student performance
  const adjustTeachingSpeed = useCallback((correct: boolean, responseTime: number) => {
    if (correct && responseTime < 10000) { // Quick correct answer
      setAdaptiveSpeed(prev => Math.min(prev + 0.1, 1.8)); // Speed up
      setEngagementLevel(prev => Math.min(prev + 5, 100));
    } else if (!correct || responseTime > 20000) { // Wrong or slow answer
      setAdaptiveSpeed(prev => Math.max(prev - 0.1, 1.0)); // Slow down
      setEngagementLevel(prev => Math.max(prev - 3, 20));
    }
  }, []);

  // Generate encouraging responses with humor
  const generateEncouragement = useCallback((isCorrect: boolean, streak: number) => {
    if (isCorrect) {
      const celebrations = [
        "Fantastic! You're like a learning superhero!",
        "Brilliant! Your brain is absolutely amazing!",
        "Outstanding! You're making learning look easy!",
        "Incredible! You're becoming a real expert!",
        "Phenomenal! That was perfect thinking!",
        "Spectacular! You're on fire today!",
        "Magnificent! Your intelligence is shining bright!"
      ];
      
      if (streak >= 3) {
        return `🔥 WOW! ${streak} correct in a row! ${celebrations[Math.floor(Math.random() * celebrations.length)]} You're unstoppable!`;
      }
      
      return celebrations[Math.floor(Math.random() * celebrations.length)];
    } else {
      const encouragements = [
        "No worries! Even Einstein made mistakes while learning!",
        "That's okay! Every mistake is a step closer to mastery!",
        "Don't worry! The best learners try, adjust, and try again!",
        "It's all good! Learning means exploring, and you're exploring perfectly!",
        "No problem! Your brain is processing new information - that's amazing!",
        "That's fine! Every great thinker has moments like this!"
      ];
      
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    }
  }, []);

  // Enhanced activity content with micro-learning chunks
  const enhanceActivityContent = useCallback((activity: LessonActivity) => {
    const enhanced = { ...activity };
    
    // Reduce duration by 30% for faster learning
    enhanced.duration = Math.max(Math.floor(activity.duration * 0.7), 3);
    
    // Add engaging elements to content
    if (activity.phase === 'content-delivery') {
      const funElements = [
        "🤔 Think about this:",
        "💡 Here's the cool part:",
        "🎯 The secret is:",
        "✨ Amazing fact:",
        "🚀 Ready for this?"
      ];
      
      const randomElement = funElements[Math.floor(Math.random() * funElements.length)];
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
    toggleMute,
    stopSpeaking
  };
};
