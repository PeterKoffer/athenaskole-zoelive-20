
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Play, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface ComputerScienceWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const ComputerScienceWelcome = ({ onStartLesson, studentName = 'Student' }: ComputerScienceWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the exciting world of Computer Science, ${studentName}! Today we're going to explore coding, algorithms, and digital creativity in the most fun way possible. Get ready to become a young programmer as we learn how to give instructions to computers and create amazing digital projects!`;

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
      await speakAsNelie(welcomeMessage, true, 'computer-science-welcome');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="computer-science-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border-purple-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">💻</div>
              <Code className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Computer Science & AI!</h1>
            <h2 className="text-xl text-purple-200 mb-8">Coding, Algorithms & Digital Creativity</h2>
            
            <div className="text-xl text-purple-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                {displayedText && (
                  <p className="animate-fade-in">{displayedText}</p>
                )}
                {!isTextComplete && displayedText && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-purple-200 font-bold text-lg mb-4">⚡ What You'll Create Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-purple-100">
                <div>• Basic programming concepts</div>
                <div>• Problem-solving algorithms</div>
                <div>• Interactive coding projects</div>
                <div>• AI and technology basics</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleSpeakWelcome}
                variant="outline"
                className="border-purple-400 text-purple-200 bg-purple-800/50 hover:bg-purple-700 transition-colors"
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
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Coding Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default ComputerScienceWelcome;
