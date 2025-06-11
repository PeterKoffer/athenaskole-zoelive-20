
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityInteractiveGameProps {
  activity: LessonActivity;
  timeRemaining: number;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivityInteractiveGame = ({
  activity,
  timeRemaining,
  onAnswerSubmit
}: ActivityInteractiveGameProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Reset state when activity changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResult(false);
  }, [activity.id]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || hasAnswered) return;
    
    setHasAnswered(true);
    setShowResult(true);
    
    const isCorrect = selectedAnswer === activity.content.correctAnswer;
    
    setTimeout(() => {
      onAnswerSubmit(isCorrect);
    }, 2000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{activity.title}</span>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-white text-lg">{activity.content.question}</p>
        </div>

        <div className="space-y-3">
          {activity.content.options?.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left justify-start p-4 h-auto text-wrap ${
                selectedAnswer === index
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              } ${
                showResult && index === activity.content.correctAnswer
                  ? "bg-green-600 border-green-600"
                  : ""
              } ${
                showResult && selectedAnswer === index && index !== activity.content.correctAnswer
                  ? "bg-red-600 border-red-600"
                  : ""
              }`}
            >
              <span className="mr-3 font-semibold text-sm">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {showResult && index === activity.content.correctAnswer && (
                <CheckCircle className="w-5 h-5 ml-2 text-white" />
              )}
              {showResult && selectedAnswer === index && index !== activity.content.correctAnswer && (
                <XCircle className="w-5 h-5 ml-2 text-white" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className={`font-semibold ${
              selectedAnswer === activity.content.correctAnswer ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === activity.content.correctAnswer ? 'Excellent work!' : 'Not quite right, but great effort!'}
            </p>
            {selectedAnswer !== activity.content.correctAnswer && (
              <p className="text-gray-300 mt-2">
                The correct answer was: {activity.content.options[activity.content.correctAnswer]}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          {!hasAnswered ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="text-center text-gray-400">
              <p>Moving to next activity...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInteractiveGame;
