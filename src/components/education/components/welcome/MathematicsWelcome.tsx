
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

  const welcomeMessage = `Welcome to the exciting world of Mathematics, ${studentName}! Today we're going to explore numbers, patterns, and problem-solving in the most engaging way possible. Get ready to become a math detective as we discover how mathematics helps us understand the world around us!`;

  console.log('🧮 MathematicsWelcome rendering for:', studentName);

  useEffect(() => {
    console.log('📝 Starting text animation for mathematics welcome');
    const words = welcomeMessage.split(' ');
    let currentIndex = 0;
    
    const showNextWords = () => {
      if (currentIndex < words.length) {
        const wordsToShow = words.slice(0, currentIndex + 3).join(' ');
        setDisplayedText(wordsToShow);
        currentIndex += 3;
        setTimeout(showNextWords, 500);
      } else {
        console.log('✅ Text animation completed');
        setIsTextComplete(true);
      }
    };
    
    // Start animation after 1 second
    const timer = setTimeout(showNextWords, 1000);
    return () => clearTimeout(timer);
  }, [welcomeMessage]);

  const handleSpeakWelcome = async () => {
    if (isSpeaking) {
      console.log('🔇 Stopping speech');
      stop();
    } else {
      console.log('🔊 Starting speech for welcome message');
      await speakAsNelie(welcomeMessage, true, 'math-welcome');
    }
  };

  const handleStartLesson = () => {
    console.log('🚀 User clicked Start Math Adventure - calling onStartLesson');
    onStartLesson();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TextWithSpeaker
        text={welcomeMessage}
        context="math-welcome"
        position="corner"
        showOnHover={false}
      >
        <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4 animate-bounce">🧮</div>
              <Calculator className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Mathematics Adventure!</h1>
            <h2 className="text-xl text-purple-200 mb-8">Numbers, Patterns & Problem Solving</h2>
            
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
              <h3 className="text-purple-200 font-bold text-lg mb-4">🔢 What You'll Discover Today:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-purple-100">
                <div>• Number patterns and sequences</div>
                <div>• Problem-solving strategies</div>
                <div>• Real-world math applications</div>
                <div>• Interactive math games</div>
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
                onClick={handleStartLesson}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
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
