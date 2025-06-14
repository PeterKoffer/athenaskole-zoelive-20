import { useState, useEffect, useCallback } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

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
  } = useUnifiedSpeech();

  console.log('🎭 Introduction Flow State:', {
    currentStep,
    hasStartedFlow,
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady
  });

  // NEW: Ensure Nelie voice is enabled after first user interaction/session readiness
  useEffect(() => {
    if (isReady && hasUserInteracted && !isEnabled) {
      toggleEnabled();
      // Don't return; let the other effects handle step speech
    }
  }, [isReady, hasUserInteracted, isEnabled, toggleEnabled]);

  // Start introduction flow automatically when ready
  useEffect(() => {
    if (!hasStartedFlow && isReady) {
      setHasStartedFlow(true);
      const timer = setTimeout(() => {
        const firstStep = introductionSteps[0]?.text;
        if (firstStep && isEnabled && hasUserInteracted) {
          speak(firstStep, true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStartedFlow, isReady, introductionSteps, isEnabled, hasUserInteracted, speak]);

  // Auto-advance through introduction steps with longer delays
  useEffect(() => {
    if (hasStartedFlow && currentStep < introductionSteps.length - 1) {
      const timer = setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // Speak the next step
        const nextStepText = introductionSteps[nextStep]?.text;
        if (nextStepText && isEnabled && hasUserInteracted) {
          console.log('🔊 Nelie speaking step:', nextStep + 1);
          speak(nextStepText, true);
        }
      }, 8000); // 8 seconds per step for better pacing
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasStartedFlow, introductionSteps, isEnabled, hasUserInteracted, speak]);

  const handleMuteToggleWrapper = useCallback(() => {
    console.log('🔊 Mute toggle clicked, current state:', { isEnabled, hasUserInteracted });
    
    if (!hasUserInteracted) {
      console.log('🔊 Enabling user interaction for first time');
      enableUserInteraction();
      // Wait a moment then enable speech
      setTimeout(() => {
        if (!isEnabled) {
          toggleEnabled();
        }
      }, 100);
    } else {
      toggleEnabled();
    }
  }, [hasUserInteracted, enableUserInteraction, toggleEnabled, isEnabled]);

  const handleManualRead = useCallback(() => {
    console.log('🔊 Manual read button clicked');
    const currentStepText = introductionSteps[currentStep]?.text;
    
    if (!currentStepText) {
      console.warn('⚠️ No current step text available for manual read');
      return;
    }

    if (!hasUserInteracted) {
      console.log('🔊 Enabling user interaction for manual read');
      enableUserInteraction();
      // Wait a bit then enable speech and speak
      setTimeout(() => {
        if (!isEnabled) {
          toggleEnabled();
        }
        setTimeout(() => {
          speak(currentStepText, true);
        }, 200);
      }, 100);
    } else if (isSpeaking) {
      console.log('🔊 Stopping current speech');
      stop();
    } else {
      console.log('🔊 Starting manual read:', currentStepText.substring(0, 50) + '...');
      speak(currentStepText, true);
    }
  }, [currentStep, introductionSteps, isSpeaking, hasUserInteracted, speak, stop, enableUserInteraction, toggleEnabled, isEnabled]);

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
