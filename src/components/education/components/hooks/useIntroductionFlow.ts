
import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';

interface IntroductionStep {
  text: string;
  duration: number;
}

export const useIntroductionFlow = (subject: string) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSpeaking, autoReadEnabled, speakText, stopSpeaking, handleMuteToggle } = useSpeechSynthesis();

  const getSubjectGreeting = () => {
    switch (subject) {
      case 'mathematics':
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to have an amazing Mathematics lesson together!";
      case 'music':
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to explore the wonderful world of Music together!";
      case 'science':
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to discover exciting Science concepts together!";
      case 'english':
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to have a fantastic English lesson together!";
      case 'creative_writing':
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to unleash your creativity with writing together!";
      default:
        return "Hi there! I'm Nelie, your AI learning companion. Today we're going to have an amazing lesson together!";
    }
  };

  const getSubjectContent = () => {
    switch (subject) {
      case 'mathematics':
        return [
          "We'll be exploring arithmetic - the foundation of all mathematics. You'll learn to solve problems step by step.",
          "Watch me demonstrate how to solve questions, then you'll try some on your own. I'll guide you every step of the way!",
          "Our lesson will include interactive questions, fun games, and plenty of practice. Are you ready to start learning?"
        ];
      case 'music':
        return [
          "We'll be exploring music theory - scales, notes, and rhythm. You'll discover the building blocks of beautiful music.",
          "I'll explain musical concepts clearly, then you'll practice with interactive questions. Music theory is easier than you think!",
          "Our lesson will include listening exercises, theory questions, and musical discoveries. Are you ready to make music?"
        ];
      case 'science':
        return [
          "We'll be exploring fascinating scientific concepts. You'll learn how the world around us works through fun experiments and discoveries.",
          "I'll explain science concepts step by step, then you'll apply what you've learned. Science is all around us!",
          "Our lesson will include interactive experiments, discovery questions, and amazing facts. Are you ready to explore science?"
        ];
      case 'english':
        return [
          "We'll be improving your reading and language skills. You'll discover new vocabulary and improve your comprehension.",
          "I'll guide you through reading exercises and explain concepts clearly. Reading opens up amazing worlds!",
          "Our lesson will include reading comprehension, vocabulary building, and language practice. Are you ready to read?"
        ];
      case 'creative_writing':
        return [
          "We'll be crafting amazing stories together. You'll learn storytelling techniques and unleash your imagination.",
          "I'll guide you through creative exercises and help you express your ideas. Every great writer started somewhere!",
          "Our lesson will include story prompts, character development, and creative expression. Are you ready to write?"
        ];
      default:
        return [
          "We'll be exploring exciting educational concepts together. You'll learn step by step with my guidance.",
          "I'll explain everything clearly and help you practice. Learning is an adventure!",
          "Our lesson will include interactive questions and plenty of practice. Are you ready to learn?"
        ];
    }
  };

  const introductionSteps: IntroductionStep[] = [
    {
      text: getSubjectGreeting(),
      duration: 5000
    },
    ...getSubjectContent().map(text => ({
      text,
      duration: 6000
    }))
  ];

  // Combined useEffect for step progression and speech
  useEffect(() => {
    const currentStepData = introductionSteps[currentStep];
    
    if (!currentStepData) return;

    let speakTimeout: NodeJS.Timeout;
    let advanceTimeout: NodeJS.Timeout;

    // Auto-speak if enabled
    if (autoReadEnabled) {
      speakTimeout = setTimeout(() => {
        console.log('🎯 Speaking step:', currentStep, currentStepData.text.substring(0, 50));
        speakText(currentStepData.text);
      }, 800);
    }

    // Auto-advance to next step
    advanceTimeout = setTimeout(() => {
      if (currentStep < introductionSteps.length - 1) {
        console.log('🎯 Advancing to step:', currentStep + 1);
        setCurrentStep(prev => prev + 1);
      }
    }, currentStepData.duration);

    // Cleanup function
    return () => {
      if (speakTimeout) clearTimeout(speakTimeout);
      if (advanceTimeout) clearTimeout(advanceTimeout);
    };
  }, [currentStep, autoReadEnabled, speakText]);

  const handleManualRead = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const currentText = introductionSteps[currentStep]?.text;
      if (currentText) {
        console.log('🎯 Manual read triggered for step:', currentStep);
        speakText(currentText);
      }
    }
  };

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
