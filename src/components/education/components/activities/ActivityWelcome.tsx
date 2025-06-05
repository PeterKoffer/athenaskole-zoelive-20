
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, BookOpen, Calculator, Microscope, Palette, Music, Code } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityWelcomeProps {
  activity: LessonActivity;
  timeRemaining: number;
  isNelieReady: boolean;
}

const ActivityWelcome = ({ activity, timeRemaining, isNelieReady }: ActivityWelcomeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);

  const fullMessage = activity.content.message;

  // Faster text display to sync with faster speech
  useEffect(() => {
    if (isNelieReady && fullMessage) {
      setDisplayedText('');
      setIsTextComplete(false);
      
      // Start showing text after a shorter delay
      const startDelay = setTimeout(() => {
        const words = fullMessage.split(' ');
        let currentIndex = 0;
        
        const showNextWords = () => {
          if (currentIndex < words.length) {
            // Show 3-4 words at a time for faster flow
            const wordsToShow = words.slice(0, currentIndex + 3).join(' ');
            setDisplayedText(wordsToShow);
            currentIndex += 3;
            
            // Reduced delay to sync with faster speech (1.3x speed)
            setTimeout(showNextWords, 600); // Reduced from 800ms to 600ms
          } else {
            setIsTextComplete(true);
          }
        };
        
        showNextWords();
      }, 1500); // Reduced from 2000ms to 1500ms
      
      return () => clearTimeout(startDelay);
    }
  }, [isNelieReady, fullMessage]);

  // Reset when activity changes
  useEffect(() => {
    setDisplayedText('');
    setIsTextComplete(false);
  }, [activity.id]);

  const getSubjectIcon = (title: string) => {
    if (title.toLowerCase().includes('mathematics') || title.toLowerCase().includes('math')) {
      return Calculator;
    }
    if (title.toLowerCase().includes('english')) {
      return BookOpen;
    }
    if (title.toLowerCase().includes('science')) {
      return Microscope;
    }
    if (title.toLowerCase().includes('creative') || title.toLowerCase().includes('art')) {
      return Palette;
    }
    if (title.toLowerCase().includes('music')) {
      return Music;
    }
    if (title.toLowerCase().includes('computer')) {
      return Code;
    }
    return Star;
  };

  const getSubjectEmoji = (title: string) => {
    if (title.toLowerCase().includes('mathematics') || title.toLowerCase().includes('math')) {
      return '🔢';
    }
    if (title.toLowerCase().includes('english')) {
      return '📚';
    }
    if (title.toLowerCase().includes('science')) {
      return '🔬';
    }
    if (title.toLowerCase().includes('creative') || title.toLowerCase().includes('art')) {
      return '🎨';
    }
    if (title.toLowerCase().includes('music')) {
      return '🎵';
    }
    if (title.toLowerCase().includes('computer')) {
      return '💻';
    }
    return '⭐';
  };

  const SubjectIcon = getSubjectIcon(activity.title);
  const subjectEmoji = getSubjectEmoji(activity.title);

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">{subjectEmoji}</div>
          <SubjectIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">{activity.title}</h2>
        
        <div className="text-xl text-purple-200 mb-6 leading-relaxed min-h-[8rem] flex items-center justify-center">
          <div className="max-w-2xl">
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
        
        {isNelieReady && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300">Nelie is welcoming you to class...</span>
          </div>
        )}
        
        <div className="text-purple-300">
          Class starting in {timeRemaining} seconds...
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityWelcome;
