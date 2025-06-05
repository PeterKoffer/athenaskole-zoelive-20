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
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDisplayingText, setIsDisplayingText] = useState(false);

  // Split the welcome message into sentences for progressive display
  const getTextSegments = (message: string) => {
    // Split by sentences but keep punctuation
    const segments = message.split(/(?<=[.!?])\s+/).filter(segment => segment.trim().length > 0);
    return segments.length > 1 ? segments : [message]; // Fallback to full message if no sentences found
  };

  const textSegments = getTextSegments(activity.content.message);

  // Start displaying text segments progressively when Nelie is ready
  useEffect(() => {
    if (isNelieReady && !isDisplayingText) {
      setIsDisplayingText(true);
      
      // Start with first segment immediately
      setCurrentTextIndex(1);
      
      // Show subsequent segments with timing that allows speech to complete
      if (textSegments.length > 1) {
        const showNextSegment = (index: number) => {
          if (index < textSegments.length) {
            setTimeout(() => {
              setCurrentTextIndex(index + 1);
              if (index + 1 < textSegments.length) {
                // Calculate delay based on text length (roughly 150 words per minute speech rate)
                const wordsInSegment = textSegments[index].split(' ').length;
                const delay = Math.max(2000, wordsInSegment * 400); // Minimum 2 seconds, ~400ms per word
                showNextSegment(index + 1);
              }
            }, index === 0 ? 1000 : Math.max(2000, textSegments[index - 1].split(' ').length * 400));
          }
        };
        
        showNextSegment(1);
      }
    }
  }, [isNelieReady, isDisplayingText, textSegments]);

  // Reset when activity changes
  useEffect(() => {
    setCurrentTextIndex(0);
    setIsDisplayingText(false);
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

  // Display text progressively as segments become available
  const displayedText = textSegments.slice(0, currentTextIndex).join(' ');

  return (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">{subjectEmoji}</div>
          <SubjectIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">{activity.title}</h2>
        
        <div className="text-xl text-purple-200 mb-6 leading-relaxed min-h-[3rem]">
          {displayedText && (
            <p className="animate-fade-in">{displayedText}</p>
          )}
          {currentTextIndex < textSegments.length && (
            <div className="flex items-center justify-center mt-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
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
