
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award, BookOpen, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';

interface ActivitySummaryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivitySummary = ({ activity, timeRemaining, onContinue, onAnswerSubmit }: ActivitySummaryProps) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasNelieRead, setHasNelieRead] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const simpleSpeech = useSimpleMobileSpeech();
  const readingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when activity changes
  useEffect(() => {
    setShowAssessment(false);
    setSelectedAnswer(null);
    setShowResult(false);
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
    const estimatedReadingTime = (wordCount / 150) * 60 * 1000; // Convert to milliseconds
    
    readingTimeoutRef.current = setTimeout(() => {
      setHasNelieRead(true);
    }, estimatedReadingTime);
  };

  const handleShowAssessment = () => {
    setShowAssessment(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === activity.content.selfAssessment?.correctAnswer;
    
    setTimeout(() => {
      onAnswerSubmit(isCorrect);
    }, 2500);
  };

  // Check if enough time has passed for reading (minimum 15 seconds)
  const hasEnoughTimePassedForReading = () => {
    if (!readingStartTime) return false;
    const timeElapsed = Date.now() - readingStartTime;
    return timeElapsed >= 15000; // 15 seconds minimum
  };

  const canProceed = hasNelieRead || hasEnoughTimePassedForReading();

  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-400 mx-2 sm:mx-0">
      <CardContent className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mr-3" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{activity.title}</h3>
              <p className="text-emerald-200 text-sm">{activity.phaseDescription}</p>
            </div>
          </div>
          
          {/* Let Nelie Read Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNelieRead}
            disabled={simpleSpeech.isSpeaking || !simpleSpeech.isEnabled}
            className="bg-white text-emerald-900 border-emerald-400 hover:bg-emerald-50 flex items-center gap-2 whitespace-nowrap"
          >
            {simpleSpeech.isEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {simpleSpeech.isSpeaking ? 'Nelie is reading...' : 'Let Nelie Read'}
          </Button>
        </div>
        
        {!showAssessment ? (
          <div className="space-y-6">
            <div className="bg-emerald-800/30 rounded-lg p-4 sm:p-6">
              <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-4">🎯 Key Takeaways</h4>
              <ul className="space-y-3">
                {(activity.content.keyTakeaways || [
                  "Animals live in habitats that provide food, water, shelter, and space",
                  "Plants need sunlight, water, air, and nutrients to grow", 
                  "The water cycle moves water between oceans, sky, and land",
                  "Living things have special adaptations for their environment",
                  "Scientists learn by observing the natural world carefully"
                ]).map((takeaway: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3 text-emerald-100">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-700/30 rounded-lg p-4 sm:p-6">
              <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-3 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                What's Next?
              </h4>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                {activity.content.whatNext || "Next, we'll explore the human body and discover how your heart, lungs, and brain work together to keep you healthy and active!"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="text-emerald-300 text-sm order-2 sm:order-1">
                Phase 6 of 6 • Summary & Next Steps
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                <Button
                  onClick={handleShowAssessment}
                  disabled={!canProceed}
                  className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
                    canProceed 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {!canProceed ? 'Listen to Nelie first...' : 'Quick Self-Assessment'}
                </Button>
                
                <Button
                  onClick={onContinue}
                  disabled={!canProceed}
                  className={`w-full sm:w-auto px-6 py-3 text-base font-semibold ${
                    canProceed 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {!canProceed ? 'Wait for Nelie...' : 'Complete Lesson'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Self-assessment section
          <div className="space-y-6">
            <div className="bg-emerald-800/30 rounded-lg p-4 sm:p-6">
              <h4 className="text-emerald-300 font-bold text-lg sm:text-xl mb-4">Quick Check</h4>
              <p className="text-emerald-100 text-base sm:text-lg mb-6">
                {activity.content.selfAssessment?.question || "What was the most important thing you learned in this lesson?"}
              </p>
              
              <div className="space-y-3">
                {(activity.content.selfAssessment?.options || [
                  "How animals and plants depend on their environment",
                  "The importance of water in nature",
                  "How scientists observe and learn",
                  "All of the above"
                ]).map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full text-left justify-start p-3 sm:p-4 h-auto ${
                      selectedAnswer === index
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-emerald-700 border-emerald-600 text-white hover:bg-emerald-600"
                    } ${
                      showResult && index === (activity.content.selfAssessment?.correctAnswer || 3)
                        ? "bg-green-600 border-green-600"
                        : ""
                    }`}
                  >
                    <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-sm sm:text-base">{option}</span>
                    {showResult && index === (activity.content.selfAssessment?.correctAnswer || 3) && (
                      <CheckCircle className="w-5 h-5 ml-auto text-white" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className="bg-emerald-700/50 rounded-lg p-4">
                <p className="text-emerald-300 font-semibold mb-2">
                  {selectedAnswer === (activity.content.selfAssessment?.correctAnswer || 3) 
                    ? 'Excellent! 🎉' 
                    : 'Good thinking! 💭'
                  }
                </p>
                <p className="text-emerald-100 text-sm sm:text-base">
                  {activity.content.selfAssessment?.explanation || "All of these concepts work together in nature!"}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold w-full sm:w-auto"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="text-center text-emerald-400">
                  <p className="text-sm sm:text-base">Completing lesson...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
