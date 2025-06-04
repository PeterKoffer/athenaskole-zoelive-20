
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

  const introductionSteps = [{
    text: "Hi there! I'm Nelie, your AI learning companion. Today we're going to have an amazing Mathematics lesson together!",
    duration: 4000
  }, {
    text: "We'll be exploring arithmetic - the foundation of all mathematics. You'll learn to solve problems step by step.",
    duration: 5000
  }, {
    text: "Watch me demonstrate how to solve questions, then you'll try some on your own. I'll guide you every step of the way!",
    duration: 6000
  }, {
    text: "Our lesson will include interactive questions, fun games, and plenty of practice. Are you ready to start learning?",
    duration: 5000
  }];

  useEffect(() => {
    const currentStepData = introductionSteps[currentStep];
    if (currentStepData && autoReadEnabled) {
      speakText(currentStepData.text);
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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <RobotAvatar size="3xl" isActive={true} isSpeaking={isSpeaking} />
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
