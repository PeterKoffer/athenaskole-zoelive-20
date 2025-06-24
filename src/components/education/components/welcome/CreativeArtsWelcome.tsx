
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Brush, Heart, Sparkles } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';

interface CreativeArtsWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

export const CreativeArtsWelcome = ({ onStartLesson, studentName = 'Student' }: CreativeArtsWelcomeProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomePhases = [
    {
      text: `🎨 Welcome to the Creative Arts Studio, ${studentName}! 🎨`,
      description: "A place where imagination takes shape and creativity knows no limits..."
    },
    {
      text: "I'm Nelie, your artistic guide!",
      description: "Together, we'll explore colors, shapes, textures, and express ourselves through beautiful art."
    },
    {
      text: "Today's Creative Adventure:",
      description: "We'll learn about different art forms, create amazing projects, and discover the artist within you!"
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
          `creative-arts-welcome-${currentPhase}`
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
      await speakAsNelie(fullWelcome, true, 'full-creative-arts-welcome');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-lg border-orange-400/50 shadow-2xl">
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
              <Palette className="w-16 h-16 text-red-400 animate-bounce" style={{ animationDelay: '0s' }} />
              <Brush className="w-12 h-12 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Heart className="w-14 h-14 text-pink-400 animate-spin" style={{ animationDelay: '1s' }} />
              <Sparkles className="w-12 h-12 text-yellow-400 animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="absolute -top-4 -left-4 text-6xl animate-float">🎨</div>
            <div className="absolute -top-2 -right-8 text-4xl animate-float" style={{ animationDelay: '1s' }}>✨</div>
            <div className="absolute -bottom-6 left-8 text-5xl animate-float" style={{ animationDelay: '2s' }}>🖌️</div>
          </div>

          <div className="space-y-6 mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
              {displayText}
            </h1>
            
            {currentPhase >= 1 && (
              <p className="text-2xl text-orange-200 animate-fade-in">
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
                    ? 'bg-orange-400 animate-pulse' 
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
                className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                🚀 Begin Our Creative Journey! 🎨
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
