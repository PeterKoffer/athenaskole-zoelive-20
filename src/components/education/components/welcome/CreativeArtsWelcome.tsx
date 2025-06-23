
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Play, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface CreativeArtsWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const CreativeArtsWelcome = ({ onStartLesson, studentName = 'Student' }: CreativeArtsWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the colorful world of Creative Arts, ${studentName}! Today we're going to explore imagination, colors, and artistic expression in the most inspiring way possible. Get ready to become a young artist as we create, design, and discover the amazing power of creativity that lives inside everyone!`;

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
      await speakAsNelie(welcomeMessage, true, 'creative-arts-welcome');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="creative-arts-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900 border-violet-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎨</div>
              <Palette className="w-16 h-16 text-violet-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Creative Arts Studio!</h1>
            <h2 className="text-xl text-violet-200 mb-8">Imagination, Colors & Artistic Expression</h2>
            
            <div className="text-xl text-violet-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                {displayedText && (
                  <p className="animate-fade-in">{displayedText}</p>
                )}
                {!isTextComplete && displayedText && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-violet-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-violet-200 font-bold text-lg mb-4">🖌️ What You'll Create Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-violet-100">
                <div>• Colorful art projects</div>
                <div>• Creative design challenges</div>
                <div>• Art history exploration</div>
                <div>• Personal artistic expression</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleSpeakWelcome}
                variant="outline"
                className="border-violet-400 text-violet-200 bg-violet-800/50 hover:bg-violet-700 transition-colors"
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
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creative Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default CreativeArtsWelcome;
