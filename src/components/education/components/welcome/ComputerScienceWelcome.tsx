
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Monitor, Cpu, Sparkles } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';

interface ComputerScienceWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

export const ComputerScienceWelcome = ({ onStartLesson, studentName = 'Student' }: ComputerScienceWelcomeProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomePhases = [
    {
      text: `💻 Welcome to the Computer Science Lab, ${studentName}! 💻`,
      description: "A place where code comes to life and digital creativity knows no bounds..."
    },
    {
      text: "I'm Nelie, your coding companion!",
      description: "Together, we'll explore programming, problem-solving, and the amazing world of technology."
    },
    {
      text: "Today's Coding Adventure:",
      description: "We'll learn programming concepts, build digital projects, and discover how code shapes our modern world!"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPhase < welcomePhases.length) {
        const phase = welcomePhases[currentPhase];
        setDisplayText(phase.text);
        
        speakAsNelie(
          `${phase.text} ${phase.description}`,
          true,
          `computer-science-welcome-${currentPhase}`
        );
        
        setTimeout(() => {
          setCurrentPhase(prev => prev + 1);
        }, 4000);
      }
    }, 1000 + currentPhase * 4500);

    return () => clearTimeout(timer);
  }, [currentPhase, speakAsNelie, studentName]);

  const handleSpeakWelcome = async () => {
    if (isSpeaking) {
      stop();
    } else {
      const fullWelcome = welcomePhases.map(phase => 
        `${phase.text} ${phase.description}`
      ).join(' ');
      await speakAsNelie(fullWelcome, true, 'full-computer-science-welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-purple-400/50 shadow-2xl">
        <CardContent className="relative p-12 text-center">
          <button
            onClick={handleSpeakWelcome}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30"
            title="Ask Nelie to repeat welcome"
          >
            <CustomSpeakerIcon className="w-6 h-6" size={24} color="#0ea5e9" />
          </button>

          <div className="relative mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Code className="w-16 h-16 text-purple-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <Monitor className="w-12 h-12 text-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Cpu className="w-14 h-14 text-blue-400 animate-spin" style={{ animationDelay: '1s' }} />
              <Sparkles className="w-12 h-12 text-cyan-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="absolute -top-4 -left-4 text-6xl animate-float">💻</div>
            <div className="absolute -top-2 -right-8 text-4xl animate-float" style={{ animationDelay: '1s' }}>⌨️</div>
            <div className="absolute -bottom-6 left-8 text-5xl animate-float" style={{ animationDelay: '2s' }}>🖱️</div>
          </div>

          <div className="space-y-6 mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
              {displayText}
            </h1>
            
            {currentPhase >= 1 && (
              <p className="text-2xl text-purple-200 animate-fade-in">
                {welcomePhases[currentPhase - 1]?.description}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {welcomePhases.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index < currentPhase 
                    ? 'bg-purple-400 animate-pulse' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {isSpeaking && (
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-lg">Nelie is speaking...</span>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}

          {currentPhase >= welcomePhases.length && (
            <div className="animate-fade-in">
              <Button
                onClick={onStartLesson}
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                🚀 Begin Our Coding Journey! 💻
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
