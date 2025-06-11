
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityInteractiveGameProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityInteractiveGame = ({ activity, onActivityComplete }: ActivityInteractiveGameProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  console.log('🎭 ActivityInteractiveGame rendering:', {
    activityId: activity.id,
    title: activity.title,
    selectedAnswer,
    showResult
  });

  const getCorrectAnswerIndex = () => {
    if (activity.content.correctAnswer !== undefined) {
      return activity.content.correctAnswer;
    }
    
    if (activity.content.correct !== undefined) {
      return activity.content.correct;
    }
    
    if (activity.content.segments?.[0]?.checkQuestion?.correctAnswer !== undefined) {
      return activity.content.segments[0].checkQuestion.correctAnswer;
    }
    
    console.warn('⚠️ No correct answer found for activity:', activity.id);
    return 0;
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) {
      console.log('🚫 Answer selection blocked - already showing result');
      return;
    }
    console.log('🎯 User selected answer:', answerIndex);
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || showResult) {
      console.log('🚫 Submit blocked - no answer selected or already showing result');
      return;
    }
    
    const responseTime = Date.now() - startTime;
    const correctAnswerIndex = getCorrectAnswerIndex();
    const isCorrect = selectedAnswer === correctAnswerIndex;
    
    console.log('✅ Activity submitted:', {
      selectedAnswer,
      correctAnswer: correctAnswerIndex,
      isCorrect,
      responseTime,
      activityId: activity.id
    });
    
    setShowResult(true);
    
    setTimeout(() => {
      onActivityComplete(isCorrect);
    }, 2000);
  };

  const handleNext = () => {
    console.log('➡️ Moving to next activity');
    onActivityComplete();
  };

  const correctAnswerIndex = getCorrectAnswerIndex();

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{activity.title}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => playAudio(activity.content.question || '')}
            className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <h4 className="text-lg font-medium text-white">
          {activity.content.question}
        </h4>

        <div className="space-y-3">
          {activity.content.options?.map((option, index) => (
            <Button
              key={`${activity.id}-interactive-option-${index}`}
              variant="outline"
              className={`w-full text-left justify-start p-4 h-auto transition-colors ${
                selectedAnswer === index
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {selectedAnswer === correctAnswerIndex ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <p className={`font-semibold ${
                selectedAnswer === correctAnswerIndex
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {selectedAnswer === correctAnswerIndex ? 'Excellent!' : 'Try again next time!'}
              </p>
            </div>
            <p className="text-gray-300">
              {activity.content.explanation || 
               `The correct answer is: ${activity.content.options?.[correctAnswerIndex] || 'Not available'}`}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInteractiveGame;
