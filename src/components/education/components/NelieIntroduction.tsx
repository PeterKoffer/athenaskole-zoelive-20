
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';

interface NelieIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const NelieIntroduction = ({
  subject,
  skillArea,
  onIntroductionComplete
}: NelieIntroductionProps) => {
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

  const introductionSteps = [
    {
      text: getSubjectGreeting(),
      duration: 5000
    },
    ...getSubjectContent().map(text => ({
      text,
      duration: 6000
    }))
  ];

  useEffect(() => {
    const currentStepData = introductionSteps[currentStep];
    if (currentStepData && autoReadEnabled) {
      // Add delay before speaking
      setTimeout(() => {
        speakText(currentStepData.text);
      }, 800);
      
      const timer = setTimeout(() => {
        if (currentStep < introductionSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStepData.duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, autoReadEnabled, speakText]);

  const handleStartLesson = () => {
    stopSpeaking();
    onIntroductionComplete();
  };

  const handleManualRead = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(introductionSteps[currentStep]?.text || '');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <RobotAvatar size="4xl" isActive={true} isSpeaking={isSpeaking} />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to {subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie!
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-lg text-white leading-relaxed">
              {introductionSteps[currentStep]?.text}
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {introductionSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full ${index <= currentStep ? 'bg-purple-400' : 'bg-gray-600'}`} 
              />
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleMuteToggle} 
              className="border-purple-400 text-slate-950"
            >
              {autoReadEnabled ? (
                <VolumeX className="w-4 h-4 mr-2" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              {autoReadEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleManualRead} 
              className="border-purple-400 text-slate-950"
              disabled={!autoReadEnabled}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isSpeaking ? 'Stop Nelie' : 'Ask Nelie to Repeat'}
            </Button>
            
            {currentStep >= introductionSteps.length - 1 && (
              <Button 
                onClick={handleStartLesson} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Lesson
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NelieIntroduction;
