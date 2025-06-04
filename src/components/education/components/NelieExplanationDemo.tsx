
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, ArrowRight, CheckCircle } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';

interface NelieExplanationDemoProps {
  subject: string;
  skillArea: string;
  onDemoComplete: () => void;
}

const NelieExplanationDemo = ({ subject, skillArea, onDemoComplete }: NelieExplanationDemoProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { isSpeaking, speakText, stopSpeaking } = useSpeechSynthesis();

  const demoQuestion = {
    question: "What is 15 + 27?",
    explanation: [
      "Let me show you how to solve this step by step!",
      "First, I'll line up the numbers: 15 + 27",
      "Starting with the ones place: 5 + 7 = 12",
      "I write down 2 and carry the 1 to the tens place",
      "Now the tens place: 1 + 2 + 1 (carried) = 4",
      "So our answer is 42! Let me click it for you."
    ],
    options: ["32", "42", "52", "38"],
    correct: 1
  };

  useEffect(() => {
    if (currentStep < demoQuestion.explanation.length) {
      const timer = setTimeout(() => {
        speakText(demoQuestion.explanation[currentStep]);
        setCurrentStep(prev => prev + 1);
      }, currentStep === 0 ? 1000 : 4000);
      
      return () => clearTimeout(timer);
    } else if (currentStep === demoQuestion.explanation.length && !showAnswer) {
      // Show Nelie "clicking" the correct answer
      setTimeout(() => {
        setShowAnswer(true);
        speakText("Perfect! That's how we solve addition problems step by step.");
      }, 2000);
    }
  }, [currentStep, showAnswer, speakText]);

  const handleContinue = () => {
    stopSpeaking();
    onDemoComplete();
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <RobotAvatar size="2xl" isActive={true} isSpeaking={isSpeaking} />
          <h3 className="text-xl font-bold text-white mt-4">Watch Nelie Solve This Problem</h3>
        </div>

        {/* Question Display */}
        <Card className="bg-gray-700 border-gray-600 mb-6">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">{demoQuestion.question}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {demoQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`p-4 text-lg border-gray-500 text-white bg-gray-600 hover:bg-gray-500 relative ${
                    showAnswer && index === demoQuestion.correct 
                      ? 'ring-4 ring-green-400 bg-green-600 hover:bg-green-600' 
                      : ''
                  }`}
                  disabled
                >
                  {option}
                  {showAnswer && index === demoQuestion.correct && (
                    <CheckCircle className="w-6 h-6 text-green-400 absolute -top-2 -right-2" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation Box */}
        <Card className="bg-blue-900 border-blue-600 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Volume2 className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-200 mb-2">Nelie's Explanation:</h4>
                <div className="text-blue-100 space-y-2">
                  {demoQuestion.explanation.slice(0, currentStep).map((step, index) => (
                    <p key={index} className={index === currentStep - 1 ? 'font-semibold' : ''}>
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        {showAnswer && (
          <div className="text-center">
            <Button onClick={handleContinue} className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowRight className="w-4 h-4 mr-2" />
              Now You Try Some Questions!
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NelieExplanationDemo;
