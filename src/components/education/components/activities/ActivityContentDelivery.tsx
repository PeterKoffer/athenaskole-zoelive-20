
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityContentDeliveryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivityContentDelivery = ({
  activity,
  timeRemaining,
  onContinue,
  onAnswerSubmit
}: ActivityContentDeliveryProps) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const segments = activity.content.segments || [];
  const currentSegment = segments[currentSegmentIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentSegment?.checkQuestion) return;
    
    setShowResult(true);
    const wasCorrect = selectedAnswer === currentSegment.checkQuestion.correctAnswer;
    
    setTimeout(() => {
      onAnswerSubmit(wasCorrect);
      
      // Move to next segment or continue to next activity
      if (currentSegmentIndex < segments.length - 1) {
        setCurrentSegmentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setTimeout(() => onContinue(), 2000);
      }
    }, 2500);
  };

  const handleSkipToNext = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onContinue();
    }
  };

  if (!currentSegment) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <p className="text-white">Loading content...</p>
          <Button onClick={onContinue} className="mt-4 bg-blue-500 hover:bg-blue-600">
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-blue-900 text-blue-400 border-blue-400">
            <BookOpen className="w-3 h-3 mr-1" />
            {activity.phaseDescription}
          </Badge>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              Segment {currentSegmentIndex + 1} of {segments.length}
            </span>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(timeRemaining / 60)} min remaining</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          {activity.title}
        </h2>

        <div className="bg-blue-800/20 border border-blue-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">
            {currentSegment.concept}
          </h3>
          <p className="text-white text-lg leading-relaxed">
            {currentSegment.explanation}
          </p>
        </div>

        {currentSegment.checkQuestion && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
            <h4 className="text-lg font-medium mb-4 text-white">
              Quick Check: {currentSegment.checkQuestion.question}
            </h4>

            <div className="space-y-3 mb-6">
              {currentSegment.checkQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto ${
                    selectedAnswer === index
                      ? showResult
                        ? selectedAnswer === currentSegment.checkQuestion!.correctAnswer
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-red-600 border-red-500 text-white'
                        : 'bg-blue-600 border-blue-500 text-white'
                      : showResult && index === currentSegment.checkQuestion!.correctAnswer
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === currentSegment.checkQuestion!.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                <p className={`font-semibold ${
                  selectedAnswer === currentSegment.checkQuestion.correctAnswer 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {selectedAnswer === currentSegment.checkQuestion.correctAnswer ? 'Excellent!' : 'Not quite right!'}
                </p>
                <p className="text-gray-300 mt-2">
                  {currentSegment.checkQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-between">
              {/* Skip/Next button for faster progression */}
              <Button
                onClick={handleSkipToNext}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {currentSegmentIndex < segments.length - 1 ? 'Skip to Next Concept' : 'Continue to Next Activity'}
              </Button>

              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (currentSegmentIndex < segments.length - 1) {
                      setCurrentSegmentIndex(prev => prev + 1);
                      setSelectedAnswer(null);
                      setShowResult(false);
                    } else {
                      onContinue();
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {currentSegmentIndex < segments.length - 1 ? 'Next Concept' : 'Continue'}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityContentDelivery;
