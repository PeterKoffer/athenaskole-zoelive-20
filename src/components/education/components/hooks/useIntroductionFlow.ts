
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
    handleMuteToggle
  } = useWorkingNelieSpeech();

  // Enhanced speech with personality for introductions
  const speakWithEnthusiasm = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
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

  // Auto-advance through introduction steps with longer delays
  useEffect(() => {
    if (currentStep < introductionSteps.length - 1 && hasStartedSpeech) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); // Slower 4-second transitions
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, introductionSteps, hasStartedSpeech]);

  const handleMuteToggleWrapper = useCallback(() => {
    if (!hasUserInteracted) {
      setHasStartedSpeech(false);
    }
    handleMuteToggle();
  }, [handleMuteToggle, hasUserInteracted]);

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
    handleMuteToggle: handleMuteToggleWrapper,
    handleManualRead,
    stopSpeaking
  };
};
