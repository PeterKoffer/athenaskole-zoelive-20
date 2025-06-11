
import { useState, useEffect, useCallback } from 'react';
import { useConsolidatedSpeech } from '@/hooks/useConsolidatedSpeech';

const getSubjectSpecificIntroduction = (subject: string) => {
  const baseSteps = [
    { text: "Hello! I'm Nelie, your personal AI learning companion!" },
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
  const [hasStartedFlow, setHasStartedFlow] = useState(false);
  const introductionSteps = getSubjectSpecificIntroduction(subject);
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    speak,
    stop,
    toggleEnabled,
    enableUserInteraction
  } = useConsolidatedSpeech();

  // Start the introduction flow automatically when ready
  useEffect(() => {
    if (!hasStartedFlow && isReady) {
      console.log('🎯 Starting Nelie introduction flow');
      setHasStartedFlow(true);
      
      // Enable user interaction immediately for introduction
      if (!hasUserInteracted) {
        enableUserInteraction();
      }
      
      // Start speaking the first step after a short delay
      const timer = setTimeout(() => {
        const firstStep = introductionSteps[0]?.text;
        if (firstStep && isEnabled) {
          console.log('🔊 Nelie starting first introduction step');
          speak(firstStep, true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hasStartedFlow, isReady, introductionSteps, isEnabled, hasUserInteracted, speak, enableUserInteraction]);

  // Auto-advance through introduction steps with longer delays
  useEffect(() => {
    if (hasStartedFlow && currentStep < introductionSteps.length - 1) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // Speak the next step
        const nextStepText = introductionSteps[nextStep]?.text;
        if (nextStepText && isEnabled) {
          console.log('🔊 Nelie speaking step:', nextStep + 1);
          speak(nextStepText, true);
        }
      }, 8000); // 8 seconds per step for better pacing
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasStartedFlow, introductionSteps, isEnabled, speak]);

  const handleMuteToggleWrapper = useCallback(() => {
    console.log('🔊 Mute toggle clicked, current enabled state:', isEnabled);
    if (!hasUserInteracted) {
      enableUserInteraction();
    }
    toggleEnabled();
  }, [hasUserInteracted, enableUserInteraction, toggleEnabled, isEnabled]);

  const handleManualRead = useCallback(() => {
    console.log('🔊 Manual read button clicked');
    const currentStepText = introductionSteps[currentStep]?.text;
    if (currentStepText) {
      if (!hasUserInteracted) {
        console.log('🔊 Enabling user interaction for manual read');
        enableUserInteraction();
      }
      
      if (isSpeaking) {
        console.log('🔊 Stopping current speech');
        stop();
      } else {
        console.log('🔊 Starting manual read:', currentStepText.substring(0, 50) + '...');
        speak(currentStepText, true);
      }
    } else {
      console.warn('⚠️ No current step text available for manual read');
    }
  }, [currentStep, introductionSteps, isSpeaking, hasUserInteracted, speak, stop, enableUserInteraction]);

  return {
    currentStep,
    introductionSteps,
    isSpeaking,
    autoReadEnabled: isEnabled,
    handleMuteToggle: handleMuteToggleWrapper,
    handleManualRead,
    stopSpeaking: stop
  };
};
