
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
    <Card className="bg-gray-800 border-gray-700 mx-2 sm:mx-0">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-lg sm:text-xl">
          <span className="break-words">{activity.title}</span>
          <div className="flex items-center space-x-2 text-sm sm:text-base">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-white text-base sm:text-lg leading-relaxed">{activity.content.question}</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {activity.content.options?.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left justify-start p-3 sm:p-4 h-auto text-wrap min-h-[3rem] ${
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
              <span className="mr-2 sm:mr-3 font-semibold text-sm flex-shrink-0">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1 text-sm sm:text-base">{option}</span>
              {showResult && index === activity.content.correctAnswer && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white flex-shrink-0" />
              )}
              {showResult && selectedAnswer === index && index !== activity.content.correctAnswer && (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-white flex-shrink-0" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
            <p className={`font-semibold text-sm sm:text-base ${
              selectedAnswer === activity.content.correctAnswer ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === activity.content.correctAnswer ? 'Excellent work!' : 'Not quite right, but great effort!'}
            </p>
            {selectedAnswer !== activity.content.correctAnswer && (
              <p className="text-gray-300 mt-2 text-sm sm:text-base">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold w-full sm:w-auto"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-sm sm:text-base">Moving to next activity...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInteractiveGame;
