
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';

interface ActivityContentDeliveryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit?: (wasCorrect: boolean) => void;
}

const ActivityContentDelivery = ({
  activity,
  timeRemaining,
  onContinue,
  onAnswerSubmit
}: ActivityContentDeliveryProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasNelieRead, setHasNelieRead] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const simpleSpeech = useSimpleMobileSpeech();
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset interaction state when activity changes
  useEffect(() => {
    setHasInteracted(false);
    setHasNelieRead(false);
    setReadingStartTime(null);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
  }, [activity.id]);

  // Auto-read content when component mounts
  useEffect(() => {
    if (simpleSpeech.isReady && simpleSpeech.hasUserInteracted && simpleSpeech.isEnabled && !hasNelieRead) {
      setTimeout(() => {
        handleNelieRead();
      }, 1500);
    }
  }, [simpleSpeech.isReady, simpleSpeech.hasUserInteracted, simpleSpeech.isEnabled]);

  const handleNelieRead = () => {
    if (!simpleSpeech.isEnabled) return;

    let speechText = '';
    
    if (activity.content.segments && activity.content.segments.length > 0) {
      speechText = "Let me explain this step by step: ";
      activity.content.segments.forEach((segment: any, index: number) => {
        if (segment.title) {
          speechText += `${segment.title}. `;
        }
        if (segment.explanation) {
          speechText += `${segment.explanation}. `;
        }
        if (segment.example) {
          speechText += `For example: ${segment.example}. `;
        }
      });
    } else {
      speechText = `Let me explain this concept: ${activity.content.text || activity.content.explanation || activity.title}`;
    }
    
    setReadingStartTime(Date.now());
    simpleSpeech.speak(speechText, true);
    
    // Estimate reading time (average 150 words per minute)
    const wordCount = speechText.split(' ').length;
    const estimatedReadingTime = (wordCount / 150) * 60 * 1000; // Convert to milliseconds
    
    readingTimeoutRef.current = setTimeout(() => {
      setHasNelieRead(true);
    }, estimatedReadingTime);
  };

  const handleContinueClick = () => {
    setHasInteracted(true);
    onContinue();
  };

  // Check if enough time has passed for reading (minimum 10 seconds)
  const hasEnoughTimePassedForReading = () => {
    if (!readingStartTime) return false;
    const timeElapsed = Date.now() - readingStartTime;
    return timeElapsed >= 10000; // 10 seconds minimum
  };

  const canProceed = hasNelieRead || hasEnoughTimePassedForReading();

  const renderContent = () => {
    if (activity.content.segments && activity.content.segments.length > 0) {
      return (
        <div className="space-y-3 sm:space-y-4">
          {activity.content.segments.map((segment: any, index: number) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3 sm:p-4">
              {segment.title && (
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2">{segment.title}</h4>
              )}
              {segment.explanation && (
                <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{segment.explanation}</p>
              )}
              {segment.example && (
                <div className="mt-3 p-3 bg-gray-600 rounded border-l-4 border-blue-500">
                  <p className="text-blue-200 font-medium text-sm sm:text-base">Example:</p>
                  <p className="text-gray-200 text-sm sm:text-base">{segment.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
        <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
          {activity.content.text || activity.content.explanation || 'Content is being prepared...'}
        </p>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mx-2 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-lg sm:text-xl">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="break-words">{activity.title}</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Let Nelie Read Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNelieRead}
              disabled={simpleSpeech.isSpeaking || !simpleSpeech.isEnabled}
              className="bg-white text-gray-900 border-gray-400 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
            >
              {simpleSpeech.isEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              {simpleSpeech.isSpeaking ? 'Nelie is reading...' : 'Let Nelie Read'}
            </Button>
            
            <div className="flex items-center space-x-2 text-sm sm:text-base">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {renderContent()}

        {!canProceed && (
          <div className="bg-blue-800/20 rounded-lg p-3 border border-blue-600/30">
            <p className="text-blue-200 text-sm">
              📚 Please listen to Nelie's explanation before continuing to the next activity.
            </p>
          </div>
        )}

        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={handleContinueClick}
            disabled={hasInteracted || !canProceed}
            className={`px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold w-full sm:w-auto ${
              canProceed 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {!canProceed ? 'Listen to Nelie first...' : 
             hasInteracted ? 'Continuing...' : 'Continue to Next Activity'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityContentDelivery;
