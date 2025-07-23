
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LessonActivity } from '../types/LessonTypes';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';
import SummaryHeader from './summary/SummaryHeader';
import KeyTakeaways from './summary/KeyTakeaways';
import NextStepsSection from './summary/NextStepsSection';
import SelfAssessment from './summary/SelfAssessment';
import SummaryControls from './summary/SummaryControls';

interface ActivitySummaryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivitySummary = ({ activity, timeRemaining, onContinue, onAnswerSubmit }: ActivitySummaryProps) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [hasNelieRead, setHasNelieRead] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const simpleSpeech = useSimpleMobileSpeech();
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when activity changes
  useEffect(() => {
    setShowAssessment(false);
    setHasNelieRead(false);
    setReadingStartTime(null);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
  }, [activity.id]);

  // Auto-read key takeaways when component mounts
  useEffect(() => {
    if (simpleSpeech.isReady && simpleSpeech.hasUserInteracted && simpleSpeech.isEnabled && !hasNelieRead) {
      setTimeout(() => {
        handleNelieRead();
      }, 1500);
    }
  }, [simpleSpeech.isReady, simpleSpeech.hasUserInteracted, simpleSpeech.isEnabled]);

  const handleNelieRead = () => {
    if (!simpleSpeech.isEnabled) return;

    const keyTakeaways = activity.content.keyTakeaways || [];
    const whatNext = activity.content.whatNext || '';
    
    let speechText = "Let me summarize the key takeaways from this lesson: ";
    
    keyTakeaways.forEach((takeaway: string, index: number) => {
      speechText += `${index + 1}. ${takeaway}. `;
    });
    
    if (whatNext) {
      speechText += ` What's next? ${whatNext}`;
    }
    
    speechText += " Great work on completing this lesson!";
    
    setReadingStartTime(Date.now());
    simpleSpeech.speak(speechText, true);
    
    // Estimate reading time (average 150 words per minute)
    const wordCount = speechText.split(' ').length;
    const estimatedReadingTime = (wordCount / 150) * 60 * 1000;
    
    readingTimeoutRef.current = setTimeout(() => {
      setHasNelieRead(true);
    }, estimatedReadingTime);
  };

  // Check if enough time has passed for reading (minimum 15 seconds)
  const hasEnoughTimePassedForReading = () => {
    if (!readingStartTime) return false;
    const timeElapsed = Date.now() - readingStartTime;
    return timeElapsed >= 15000;
  };

  const canProceed = hasNelieRead || hasEnoughTimePassedForReading();

  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-400 mx-2 sm:mx-0">
      <CardContent className="p-4 sm:p-8">
        <SummaryHeader
          title={activity.title}
          phaseDescription={activity.phaseDescription || ''}
          onNelieRead={handleNelieRead}
          isSpeaking={simpleSpeech.isSpeaking}
          isEnabled={simpleSpeech.isEnabled}
        />
        
        {!showAssessment ? (
          <div className="space-y-6">
            <KeyTakeaways takeaways={activity.content.keyTakeaways || []} />
            <NextStepsSection whatNext={activity.content.whatNext} />
            <SummaryControls
              canProceed={canProceed}
              onShowAssessment={() => setShowAssessment(true)}
              onContinue={onContinue}
            />
          </div>
        ) : (
          <SelfAssessment
            question={activity.content.selfAssessment?.question}
            options={activity.content.selfAssessment?.options ? Array.from(activity.content.selfAssessment.options) : undefined}
            correctAnswer={activity.content.selfAssessment?.correctAnswer}
            explanation={activity.content.selfAssessment?.explanation}
            onSubmit={onAnswerSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
