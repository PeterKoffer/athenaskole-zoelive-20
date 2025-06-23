
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface MusicWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const MusicWelcome = ({ onStartLesson, studentName = 'Student' }: MusicWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the harmonious world of Music, ${studentName}! Today we're going to explore rhythm, melody, and the beautiful language of sound. Get ready to become a young musician as we discover how music touches our hearts, tells stories, and brings joy to people around the world!`;

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
      await speakAsNelie(welcomeMessage, true, 'music-welcome');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="music-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-pink-900 via-rose-900 to-red-900 border-pink-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎵</div>
              <Music className="w-16 h-16 text-pink-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Music Discovery!</h1>
            <h2 className="text-xl text-pink-200 mb-8">Rhythm, Melody & Musical Expression</h2>
            
            <div className="text-xl text-pink-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                {displayedText && (
                  <p className="animate-fade-in">{displayedText}</p>
                )}
                {!isTextComplete && displayedText && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-pink-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-pink-200 font-bold text-lg mb-4">🎼 What You'll Experience Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-pink-100">
                <div>• Rhythm and beat patterns</div>
                <div>• Musical instruments exploration</div>
                <div>• Creative composition activities</div>
                <div>• Music from around the world</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleSpeakWelcome}
                variant="outline"
                className="border-pink-400 text-pink-200 bg-pink-800/50 hover:bg-pink-700 transition-colors"
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
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Musical Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default MusicWelcome;
