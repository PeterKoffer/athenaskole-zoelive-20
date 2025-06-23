
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface EnglishWelcomeProps {
  onStartLesson: () => void;
  studentName?: string;
}

const EnglishWelcome = ({ onStartLesson, studentName = 'Student' }: EnglishWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const welcomeMessage = `Welcome to the wonderful world of English, ${studentName}! Today we're going to explore stories, words, and language in the most engaging way possible. Get ready to become a master of communication through reading adventures, creative writing, and discovering the magic of language that connects us all!`;

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
      await speakAsNelie(welcomeMessage, true, 'english-welcome');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="english-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900 border-orange-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">📚</div>
              <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">English Language Arts!</h1>
            <h2 className="text-xl text-orange-200 mb-8">Stories, Words & Creative Expression</h2>
            
            <div className="text-xl text-orange-100 mb-8 leading-relaxed min-h-[10rem] flex items-center justify-center">
              <div className="max-w-3xl">
                {displayedText && (
                  <p className="animate-fade-in">{displayedText}</p>
                )}
                {!isTextComplete && displayedText && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-orange-800/30 rounded-lg p-6 mb-8">
              <h3 className="text-orange-200 font-bold text-lg mb-4">📖 What You'll Explore Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-orange-100">
                <div>• Exciting reading adventures</div>
                <div>• Creative writing exercises</div>
                <div>• Vocabulary building games</div>
                <div>• Grammar through storytelling</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleSpeakWelcome}
                variant="outline"
                className="border-orange-400 text-orange-200 bg-orange-800/50 hover:bg-orange-700 transition-colors"
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
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Language Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </TextWithSpeaker>
    </div>
  );
};

export default EnglishWelcome;
