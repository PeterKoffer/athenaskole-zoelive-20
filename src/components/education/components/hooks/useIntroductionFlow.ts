
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

  // Automatically enable speech and start introduction
  useEffect(() => {
    if (isReady && !hasUserInteracted) {
      console.log('🎵 Auto-enabling speech for introduction');
      // Simulate user interaction to enable speech
      const clickEvent = new MouseEvent('click', { bubbles: true });
      document.dispatchEvent(clickEvent);
      
      // Enable speech automatically
      setTimeout(() => {
        toggleMute(); // This will enable speech
      }, 500);
    }
  }, [isReady, hasUserInteracted, toggleMute]);

  // Start speaking the first step automatically when speech is ready
  useEffect(() => {
    if (autoReadEnabled && hasUserInteracted && currentStep === 0 && introductionSteps[0]) {
      console.log('🎤 Auto-starting introduction speech');
      setTimeout(() => {
        speakText(introductionSteps[0].text, true);
      }, 1000);
    }
  }, [autoReadEnabled, hasUserInteracted, currentStep, introductionSteps, speakText]);

  // Auto-advance through introduction steps
  useEffect(() => {
    if (currentStep < introductionSteps.length - 1 && autoReadEnabled) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        
        // Speak the next step
        const nextStep = introductionSteps[currentStep + 1];
        if (nextStep) {
          setTimeout(() => {
            speakText(nextStep.text, true);
          }, 500);
        }
      }, 3000); // Reduced from longer delays
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, introductionSteps, autoReadEnabled, speakText]);

  const handleMuteToggle = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

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
