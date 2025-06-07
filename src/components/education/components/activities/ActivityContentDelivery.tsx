
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityContentDeliveryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivityContentDelivery = ({ activity, timeRemaining, onContinue, onAnswerSubmit }: ActivityContentDeliveryProps) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const segments = activity.content.segments || [];

  useEffect(() => {
    if (segments.length === 0) return;

    const segmentDuration = activity.duration / segments.length;
    const timer = setTimeout(() => {
      if (segments[currentSegment]?.checkQuestion) {
        setShowQuestion(true);
      } else {
        moveToNextSegment();
      }
    }, (segmentDuration * 0.7) * 1000); // Show concept for 70% of time, then question

    return () => clearTimeout(timer);
  }, [currentSegment, segments, activity.duration]);

  const moveToNextSegment = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(prev => prev + 1);
      setShowQuestion(false);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onContinue();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const currentQuestion = segments[currentSegment]?.checkQuestion;
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    
    setTimeout(() => {
      onAnswerSubmit(isCorrect);
      setTimeout(() => {
        moveToNextSegment();
      }, 2000);
    }, 1500);
  };

  const currentSegmentData = segments[currentSegment];
  const currentQuestion = currentSegmentData?.checkQuestion;

  return (
    <Card className="bg-gradient-to-br from-green-900 to-teal-900 border-green-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <BookOpen className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-green-200 text-sm">{activity.phaseDescription}</p>
          </div>
        </div>

        {!showQuestion ? (
          <div className="space-y-6">
            <div className="bg-green-800/30 rounded-lg p-6">
              <h4 className="text-green-300 font-bold text-xl mb-4">{currentSegmentData?.concept}</h4>
              <p className="text-green-100 text-lg leading-relaxed">{currentSegmentData?.explanation}</p>
            </div>
            
            <div className="text-green-300 text-center">
              Learning segment {currentSegment + 1} of {segments.length} • Understanding key concepts...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xl text-white mb-6 font-medium leading-relaxed">
              <span className="text-green-300 font-semibold">Quick Check: </span>
              {currentQuestion?.question}
            </div>
            
            <div className="space-y-3 mb-6">
              {currentQuestion?.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                    showResult
                      ? index === currentQuestion.correctAnswer
                        ? "bg-green-600 border-green-400 text-white"
                        : selectedAnswer === index
                        ? "bg-red-600 border-red-400 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300"
                      : selectedAnswer === index
                      ? "bg-green-500 text-white transform scale-105"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-bold text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                    <XCircle className="w-5 h-5 ml-auto text-red-200" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg ${
                selectedAnswer === currentQuestion?.correctAnswer 
                  ? 'bg-green-800/50 border border-green-600' 
                  : 'bg-orange-800/50 border border-orange-600'
              }`}>
                <div className="flex items-center mb-2">
                  {selectedAnswer === currentQuestion?.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-orange-400 mr-2" />
                  )}
                  <span className={`font-bold text-lg ${
                    selectedAnswer === currentQuestion?.correctAnswer ? 'text-green-300' : 'text-orange-300'
                  }`}>
                    {selectedAnswer === currentQuestion?.correctAnswer ? 'Perfect understanding!' : 'Great effort!'}
                  </span>
                </div>
                <p className="text-gray-200 leading-relaxed">{currentQuestion?.explanation}</p>
              </div>
            )}

            {!showResult && (
              <div className="flex justify-between items-center">
                <div className="text-green-300">Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  Check My Understanding
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-green-300 mt-6">
          Phase 2 of 6 • Core Content Delivery
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityContentDelivery;
