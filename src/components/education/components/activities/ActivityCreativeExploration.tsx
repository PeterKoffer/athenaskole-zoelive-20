
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Sparkles, HelpCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';
import CreativeHeader from './creative/CreativeHeader';
import CreativePrompt from './creative/CreativePrompt';
import CreativeProgressIndicator from './creative/CreativeProgressIndicator';
import CreativeControls from './creative/CreativeControls';

interface ActivityCreativeExplorationProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
}

const ActivityCreativeExploration = ({ activity, timeRemaining, onContinue }: ActivityCreativeExplorationProps) => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [hasNelieRead, setHasNelieRead] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const simpleSpeech = useSimpleMobileSpeech();
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prompts = [
    { 
      icon: Palette, 
      title: "Creative Challenge", 
      content: activity.content.creativePrompt || "If you could design an animal that could live in two different habitats (like both water and land), what special features would it need?",
      placeholder: "Describe your amazing animal design..."
    },
    { 
      icon: HelpCircle, 
      title: "What If Scenario", 
      content: activity.content.whatIfScenario || "What if all the water on Earth suddenly turned purple? How would this affect plants and animals?",
      placeholder: "Share your creative thoughts..."
    },
    { 
      icon: Sparkles, 
      title: "Innovation Task", 
      content: activity.content.explorationTask || "Imagine you're a scientist who discovers a new type of plant. Describe what makes it special and how it survives.",
      placeholder: "Describe your discovery..."
    }
  ];

  // Reset state when activity changes
  useEffect(() => {
    setCurrentPrompt(0);
    setUserResponses([]);
    setCurrentResponse('');
    setHasNelieRead(false);
    setReadingStartTime(null);
    if (readingTimeoutRef.current) {
      clearTimeout(readingTimeoutRef.current);
    }
  }, [activity.id]);

  // Auto-read the first prompt when component mounts
  useEffect(() => {
    if (simpleSpeech.isReady && simpleSpeech.hasUserInteracted && simpleSpeech.isEnabled && !hasNelieRead) {
      setTimeout(() => {
        handleNelieRead();
      }, 1500);
    }
  }, [simpleSpeech.isReady, simpleSpeech.hasUserInteracted, simpleSpeech.isEnabled]);

  const handleNelieRead = () => {
    if (!simpleSpeech.isEnabled) return;

    const currentPromptData = prompts[currentPrompt];
    const speechText = `Here's your creative challenge: ${currentPromptData.content} Take your time to think creatively about this!`;
    
    setReadingStartTime(Date.now());
    simpleSpeech.speak(speechText, true);
    
    // Estimate reading time
    const wordCount = speechText.split(' ').length;
    const estimatedReadingTime = (wordCount / 150) * 60 * 1000;
    
    readingTimeoutRef.current = setTimeout(() => {
      setHasNelieRead(true);
    }, estimatedReadingTime);
  };

  const handleNextPrompt = () => {
    // Save current response
    const newResponses = [...userResponses];
    newResponses[currentPrompt] = currentResponse;
    setUserResponses(newResponses);
    
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      setCurrentResponse(userResponses[currentPrompt + 1] || '');
      setHasNelieRead(false);
      setReadingStartTime(null);
      
      // Auto-read next prompt
      setTimeout(() => {
        handleNelieRead();
      }, 500);
    } else {
      // All prompts completed
      onContinue();
    }
  };

  const handleSkipToNext = () => {
    if (currentPrompt < prompts.length - 1) {
      handleNextPrompt();
    } else {
      onContinue();
    }
  };

  // Check if enough time has passed for reading (minimum 10 seconds)
  const hasEnoughTimePassedForReading = () => {
    if (!readingStartTime) return false;
    const timeElapsed = Date.now() - readingStartTime;
    return timeElapsed >= 10000;
  };

  const canProceed = hasNelieRead || hasEnoughTimePassedForReading();
  const hasWrittenSomething = currentResponse.trim().length >= 20;
  const currentPromptData = prompts[currentPrompt];

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400 mx-2 sm:mx-0">
      <CardContent className="p-4 sm:p-8">
        <CreativeHeader
          title={activity.title}
          phaseDescription={activity.phaseDescription || ''}
          onNelieRead={handleNelieRead}
          isSpeaking={simpleSpeech.isSpeaking}
          isEnabled={simpleSpeech.isEnabled}
        />
        
        <div className="space-y-6">
          <CreativePrompt
            prompt={currentPromptData}
            response={currentResponse}
            onResponseChange={setCurrentResponse}
            canRespond={canProceed}
          />
          
          <CreativeProgressIndicator
            currentPrompt={currentPrompt}
            totalPrompts={prompts.length}
          />
          
          <CreativeControls
            currentPrompt={currentPrompt}
            totalPrompts={prompts.length}
            timeRemaining={timeRemaining}
            canProceed={canProceed}
            hasWrittenSomething={hasWrittenSomething}
            onNext={handleNextPrompt}
            onSkip={handleSkipToNext}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCreativeExploration;
