
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';

interface NelieIntroductionProps {
  subject: string;
  skillArea: string;
  onIntroductionComplete: () => void;
}

const NelieIntroduction = ({ subject, skillArea, onIntroductionComplete }: NelieIntroductionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const introductionSteps = [
    {
      text: "Hi there! I'm Nelie, your AI learning companion. Today we're going to have an amazing Mathematics lesson together!",
      duration: 4000
    },
    {
      text: "We'll be exploring arithmetic - the foundation of all mathematics. You'll learn to solve problems step by step.",
      duration: 5000
    },
    {
      text: "Watch me demonstrate how to solve questions, then you'll try some on your own. I'll guide you every step of the way!",
      duration: 6000
    },
    {
      text: "Our lesson will include interactive questions, fun games, and plenty of practice. Are you ready to start learning?",
      duration: 5000
    }
  ];

  const speakText = (text: string) => {
    if (!autoPlay) return;
    
    setIsSpeaking(true);
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    // Try to use a female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('victoria')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const currentStepData = introductionSteps[currentStep];
    if (currentStepData) {
      speakText(currentStepData.text);
      
      const timer = setTimeout(() => {
        if (currentStep < introductionSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStepData.duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, autoPlay]);

  const toggleAudio = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      speakText(introductionSteps[currentStep].text);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleStartLesson = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    onIntroductionComplete();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <RobotAvatar size="lg" isActive={true} isSpeaking={isSpeaking} />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to Mathematics with Nelie!</h1>
          
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
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-purple-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={toggleAudio}
              className="border-purple-400 text-white"
            >
              {autoPlay ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
              {autoPlay ? 'Mute Nelie' : 'Unmute Nelie'}
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
