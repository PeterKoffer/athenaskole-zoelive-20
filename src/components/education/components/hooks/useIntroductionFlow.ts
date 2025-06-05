
import { useState, useEffect, useCallback } from 'react';
import { useWorkingNelieSpeech } from '@/components/adaptive-learning/hooks/useWorkingNelieSpeech';

const getIntroductionSteps = (subject: string) => {
  const baseSteps = [
    { text: "Hello! I'm Nelie, your friendly AI learning companion!" },
    { text: "I'm so excited to learn with you today!" },
    { text: "Let's make this an amazing learning adventure together!" }
  ];

  switch (subject.toLowerCase()) {
    case 'mathematics':
      return [
        ...baseSteps,
        { text: "Today we're going to explore the wonderful world of mathematics!" },
        { text: "We'll solve problems, play games, and discover how math is all around us!" },
        { text: "Are you ready to become a math superstar?" }
      ];
    case 'english':
      return [
        ...baseSteps,
        { text: "Today we're diving into the exciting world of English!" },
        { text: "We'll read stories, learn new words, and improve our language skills!" },
        { text: "Let's become amazing readers and writers together!" }
      ];
    case 'science':
      return [
        ...baseSteps,
        { text: "Today we're exploring the fascinating world of science!" },
        { text: "We'll discover how things work and conduct fun experiments!" },
        { text: "Ready to become a young scientist?" }
      ];
    default:
      return [
        ...baseSteps,
        { text: "Let's start this amazing learning journey together!" }
      ];
  }
};

export const useIntroductionFlow = (subject: string) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStartedSpeech, setHasStartedSpeech] = useState(false);
  const introductionSteps = getIntroductionSteps(subject);
  
  const {
    isSpeaking,
    autoReadEnabled,
    hasUserInteracted,
    isReady,
    speakText,
    stopSpeaking,
    toggleMute
  } = useWorkingNelieSpeech();

  // Only enable speech once - don't auto-trigger
  useEffect(() => {
    if (isReady && !hasUserInteracted) {
      console.log('🎵 Speech ready but waiting for user interaction');
    }
  }, [isReady, hasUserInteracted]);

  // Start speaking ONLY ONCE when speech is ready and user has interacted
  useEffect(() => {
    if (autoReadEnabled && hasUserInteracted && !hasStartedSpeech && currentStep === 0 && introductionSteps[0]) {
      console.log('🎤 Starting introduction speech - ONCE ONLY');
      setHasStartedSpeech(true);
      
      setTimeout(() => {
        speakText(introductionSteps[0].text, true);
      }, 1000);
    }
  }, [autoReadEnabled, hasUserInteracted, hasStartedSpeech, currentStep, introductionSteps, speakText]);

  // Auto-advance through introduction steps - but don't speak them automatically
  useEffect(() => {
    if (currentStep < introductionSteps.length - 1 && hasStartedSpeech) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, introductionSteps, hasStartedSpeech]);

  const handleMuteToggle = useCallback(() => {
    if (!hasUserInteracted) {
      // This will enable speech for the first time
      setHasStartedSpeech(false); // Reset so speech can start
    }
    toggleMute();
  }, [toggleMute, hasUserInteracted]);

  const handleManualRead = useCallback(() => {
    const currentStepText = introductionSteps[currentStep]?.text;
    if (currentStepText) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speakText(currentStepText, true);
      }
    }
  }, [currentStep, introductionSteps, isSpeaking, speakText, stopSpeaking]);

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
