
import { useState, useEffect, useCallback } from 'react';
import { useWorkingNelieSpeech } from '@/components/adaptive-learning/hooks/useWorkingNelieSpeech';

const getSubjectSpecificIntroduction = (subject: string) => {
  const baseSteps = [
    { text: "Hello! I'm Nelie, your personal AI learning companion for this subject!" },
    { text: "I'm absolutely thrilled to explore this amazing topic with you today!" }
  ];

  switch (subject.toLowerCase()) {
    case 'mathematics':
      return [
        ...baseSteps,
        { text: "Welcome to the incredible world of mathematics! Get ready to discover patterns, solve puzzles, and unlock the secrets of numbers!" },
        { text: "We'll explore mind-bending problems and learn super cool mathematical tricks that will amaze your friends!" },
        { text: "Mathematics is like a superpower - once you master it, you can understand the entire universe! Are you ready to become a math wizard?" }
      ];
    case 'english':
      return [
        ...baseSteps,
        { text: "Welcome to our English language adventure! We're about to dive into the magical world of words, stories, and communication!" },
        { text: "Together we'll master reading, writing, and speaking skills that will help you express your brilliant ideas!" },
        { text: "English opens doors to countless stories and helps you share your own voice with the world! Ready to become a language master?" }
      ];
    case 'science':
      return [
        ...baseSteps,
        { text: "Welcome to the fascinating universe of science! We're about to uncover the amazing secrets of how everything works!" },
        { text: "From tiny atoms to massive galaxies, we'll explore experiments, discoveries, and phenomena that will blow your mind!" },
        { text: "Science helps us understand our world and even lets us predict the future! Ready to become a brilliant scientist?" }
      ];
    case 'music':
      return [
        ...baseSteps,
        { text: "Welcome to the beautiful world of music! We're about to explore rhythm, melody, and the magical language of sound!" },
        { text: "Music touches our hearts, tells stories, and brings people together from all around the world!" },
        { text: "Whether you love singing, playing instruments, or just listening, music makes life more amazing! Ready to create some musical magic?" }
      ];
    case 'computer-science':
      return [
        ...baseSteps,
        { text: "Welcome to the exciting world of computer science! We're about to explore the technology that powers our amazing digital world!" },
        { text: "We'll learn how computers think, how apps work, and maybe even create our own digital masterpieces!" },
        { text: "Computer science is like having superpowers in the digital age! Ready to become a tech wizard?" }
      ];
    case 'creative-arts':
      return [
        ...baseSteps,
        { text: "Welcome to the colorful world of creative arts! We're about to unleash your imagination and artistic superpowers!" },
        { text: "Art lets us express our feelings, tell stories without words, and create beauty that inspires others!" },
        { text: "Every great artist started exactly where you are now! Ready to create something absolutely amazing?" }
      ];
    default:
      return [
        ...baseSteps,
        { text: "Let's embark on this incredible learning journey together and discover amazing new things!" }
      ];
  }
};

export const useIntroductionFlow = (subject: string) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStartedSpeech, setHasStartedSpeech] = useState(false);
  const introductionSteps = getSubjectSpecificIntroduction(subject);
  
  const {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute
  } = useWorkingNelieSpeech();

  // Enhanced speech with personality for introductions
  const speakWithEnthusiasm = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.3; // Slightly faster for enthusiasm
      utterance.pitch = 1.2; // Higher pitch for excitement
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
    } else {
      speakText(text, true);
    }
  }, [speakText]);

  // Start speaking ONLY ONCE when speech is ready and user has interacted
  useEffect(() => {
    if (autoReadEnabled && hasUserInteracted && !hasStartedSpeech && currentStep === 0 && introductionSteps[0]) {
      console.log('🎤 Starting enhanced subject introduction speech - ONCE ONLY for:', subject);
      setHasStartedSpeech(true);
      
      setTimeout(() => {
        speakWithEnthusiasm(introductionSteps[0].text);
      }, 1000);
    }
  }, [autoReadEnabled, hasUserInteracted, hasStartedSpeech, currentStep, introductionSteps, speakWithEnthusiasm, subject]);

  // Automatically read new steps when they change (after initial setup)
  useEffect(() => {
    if (hasStartedSpeech && autoReadEnabled && hasUserInteracted && currentStep > 0) {
      const currentStepText = introductionSteps[currentStep]?.text;
      if (currentStepText) {
        console.log('🎤 Reading enhanced introduction step:', currentStep, 'for', subject);
        setTimeout(() => {
          speakWithEnthusiasm(currentStepText);
        }, 500);
      }
    }
  }, [currentStep, hasStartedSpeech, autoReadEnabled, hasUserInteracted, introductionSteps, speakWithEnthusiasm, subject]);

  // Auto-advance through introduction steps (faster pace)
  useEffect(() => {
    if (currentStep < introductionSteps.length - 1 && hasStartedSpeech) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2500); // Faster transitions
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, introductionSteps, hasStartedSpeech]);

  const handleMuteToggle = useCallback(() => {
    if (!hasUserInteracted) {
      setHasStartedSpeech(false);
    }
    toggleMute();
  }, [toggleMute, hasUserInteracted]);

  const handleManualRead = useCallback(() => {
    const currentStepText = introductionSteps[currentStep]?.text;
    if (currentStepText) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speakWithEnthusiasm(currentStepText);
      }
    }
  }, [currentStep, introductionSteps, isSpeaking, speakWithEnthusiasm, stopSpeaking]);

  return {
    currentStep,
    introductionSteps,
    isSpeaking,
    autoReadEnabled,
    handleMuteToggle,
    handleManualRead,
    stopSpeaking
  };
};
