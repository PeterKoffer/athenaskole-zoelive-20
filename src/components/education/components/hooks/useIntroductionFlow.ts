
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

  // Automatically read new steps when they change (after initial setup)
  useEffect(() => {
    if (hasStartedSpeech && autoReadEnabled && hasUserInteracted && currentStep > 0) {
      const currentStepText = introductionSteps[currentStep]?.text;
      if (currentStepText) {
        console.log('🎤 Reading new introduction step:', currentStep);
        setTimeout(() => {
          speakText(currentStepText, true);
        }, 500);
      }
    }
  }, [currentStep, hasStartedSpeech, autoReadEnabled, hasUserInteracted, introductionSteps, speakText]);

  // Auto-advance through introduction steps
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
