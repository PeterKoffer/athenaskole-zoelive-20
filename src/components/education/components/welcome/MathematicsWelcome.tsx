
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Play, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface MathematicsWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const MathematicsWelcome = ({ onStartLesson, studentName = 'Student' }: MathematicsWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the amazing world of Mathematics, ${studentName}! Today we're going to explore numbers, patterns, and problem-solving in the most exciting way possible. Get ready to become a math wizard with fun activities, challenging puzzles, and incredible discoveries that will make you fall in love with mathematics!`;

  useEffect(() => {
    const words = welcomeMessage.split(' ');
    let currentIndex = 0;
    
    const showNextWords = () => {
      if (currentIndex < words.length) {
        const wordsToShow = words.slice(0, currentIndex + 3).join(' ');
        setDisplayedText(wordsToShow);
        currentIndex += 3;
        setTimeout(showNextWords, 500);
      } else {
        setIsTextComplete(true);
      }
    };
    
    const timer = setTimeout(showNextWords, 1000);
    return () => clearTimeout(timer);
  }, [welcomeMessage]);

  const handleSpeakWelcome = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(welcomeMessage, true, 'mathematics-welcome');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="mathematics-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 border-green-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🔢</div>
              <Calculator className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Mathematics Adventure!</h1>
            <h2 className="text-xl text-green-200 mb-8">Numbers, Patterns & Problem Solving</h2>
            
            <div className="text-xl text-green-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                {displayedText && (
                  <p className="animate-fade-in">{displayedText}</p>
                )}
                {!isTextComplete && displayedText && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-green-200 font-bold text-lg mb-4">🎯 What You'll Discover Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-green-100">
                <div>• Fun number patterns and sequences</div>
                <div>• Problem-solving strategies</div>
                <div>• Interactive math games</div>
                <div>• Real-world math applications</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleSpeakWelcome}
                variant="outline"
                className="border-green-400 text-green-200 bg-green-800/50 hover:bg-green-700 transition-colors"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5 mr-2" />
                    Stop Nelie
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 mr-2" />
                    Ask Nelie to Read
                  </>
                )}
              </Button>
              
              <Button
                onClick={onStartLesson}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Math Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default MathematicsWelcome;
