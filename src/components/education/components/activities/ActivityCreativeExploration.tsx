
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Sparkles, HelpCircle, Volume2, VolumeX, CheckCircle, Lightbulb } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';

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
    return timeElapsed >= 10000; // 10 seconds minimum
  };

  const canProceed = hasNelieRead || hasEnoughTimePassedForReading();
  const hasWrittenSomething = currentResponse.trim().length >= 20; // At least 20 characters
  
  const currentPromptData = prompts[currentPrompt];
  const IconComponent = currentPromptData?.icon || Palette;

  return (
    <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400 mx-2 sm:mx-0">
      <CardContent className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mr-3" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{activity.title}</h3>
              <p className="text-purple-200 text-sm">{activity.phaseDescription}</p>
            </div>
          </div>
          
          {/* Let Nelie Read Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNelieRead}
            disabled={simpleSpeech.isSpeaking || !simpleSpeech.isEnabled}
            className="bg-white text-purple-900 border-purple-400 hover:bg-purple-50 flex items-center gap-2 whitespace-nowrap"
          >
            {simpleSpeech.isEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {simpleSpeech.isSpeaking ? 'Nelie is reading...' : 'Let Nelie Read'}
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-purple-800/30 rounded-lg p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300 mr-3" />
              <h4 className="text-purple-200 font-bold text-lg sm:text-xl">{currentPromptData?.title}</h4>
            </div>
            <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-6">{currentPromptData?.content}</p>
            
            {/* Interactive Response Area */}
            <div className="space-y-4">
              <div className="bg-purple-700/30 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-purple-200 font-medium">Your Creative Response:</span>
                </div>
                <Textarea
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  placeholder={currentPromptData?.placeholder}
                  className="w-full min-h-[120px] bg-purple-800/50 border-purple-600 text-white placeholder:text-purple-300 resize-none"
                  disabled={!canProceed}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-purple-300 text-sm">
                    {currentResponse.length} characters
                  </span>
                  {hasWrittenSomething && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Great work!
                    </div>
                  )}
                </div>
              </div>
              
              {!canProceed && (
                <div className="bg-pink-800/20 rounded-lg p-3 border border-pink-600/30">
                  <p className="text-pink-200 text-sm">
                    💭 Please listen to Nelie's instructions first before writing your response.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Prompt Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {prompts.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index < currentPrompt ? 'bg-green-400' : 
                  index === currentPrompt ? 'bg-purple-400' : 'bg-purple-700'
                }`}
              />
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-purple-300 text-sm order-2 sm:order-1">
              Phase 5 of 6 • Creative Exploration • {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} remaining
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
              {!hasWrittenSomething && canProceed && (
                <Button
                  onClick={handleSkipToNext}
                  variant="outline"
                  className="w-full sm:w-auto border-purple-400 text-purple-200 hover:bg-purple-800"
                >
                  Skip This One
                </Button>
              )}
              
              <Button
                onClick={handleNextPrompt}
                disabled={!canProceed}
                className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
                  canProceed 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!canProceed ? 'Listen to Nelie first...' : 
                 currentPrompt < prompts.length - 1 ? 'Next Creative Challenge' : 'Complete Creative Phase'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCreativeExploration;
