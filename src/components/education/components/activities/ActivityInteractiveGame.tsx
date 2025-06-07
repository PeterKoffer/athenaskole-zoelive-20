
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Gamepad2, Trophy } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivityInteractiveGameProps {
  activity: LessonActivity;
  timeRemaining: number;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivityInteractiveGame = ({ activity, timeRemaining, onAnswerSubmit }: ActivityInteractiveGameProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const correctAnswerIndex = activity.content.correctAnswer !== undefined 
      ? activity.content.correctAnswer 
      : activity.content.correct;
    
    const isCorrect = selectedAnswer === correctAnswerIndex;
    
    setTimeout(() => {
      onAnswerSubmit(isCorrect);
    }, 2500);
  };

  const correctAnswerIndex = activity.content.correctAnswer !== undefined 
    ? activity.content.correctAnswer 
    : activity.content.correct;

  return (
    <Card className="bg-gradient-to-br from-orange-900 to-red-900 border-orange-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Gamepad2 className="w-8 h-8 text-orange-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-orange-200 text-sm">{activity.phaseDescription}</p>
          </div>
        </div>
        
        <div className="bg-orange-800/30 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
            <h4 className="text-orange-200 font-semibold">Game Challenge</h4>
          </div>
          <p className="text-orange-100 leading-relaxed mb-4">{activity.content.gameInstructions}</p>
        </div>
        
        <div className="text-xl text-white mb-6 font-medium leading-relaxed">
          {activity.content.question}
        </div>
        
        <div className="space-y-3 mb-6">
          {activity.content.options?.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                showResult
                  ? index === correctAnswerIndex
                    ? "bg-green-600 border-green-400 text-white"
                    : selectedAnswer === index
                    ? "bg-red-600 border-red-400 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300"
                  : selectedAnswer === index
                  ? "bg-orange-500 text-white transform scale-105"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="mr-3 font-bold text-lg">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {showResult && index === correctAnswerIndex && (
                <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
              )}
              {showResult && selectedAnswer === index && index !== correctAnswerIndex && (
                <XCircle className="w-5 h-5 ml-auto text-red-200" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-4 ${
            selectedAnswer === correctAnswerIndex 
              ? 'bg-green-800/50 border border-green-600' 
              : 'bg-red-800/50 border border-red-600'
          }`}>
            <div className="flex items-center mb-2">
              {selectedAnswer === correctAnswerIndex ? (
                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              <span className={`font-bold text-lg ${
                selectedAnswer === correctAnswerIndex ? 'text-green-300' : 'text-red-300'
              }`}>
                {selectedAnswer === correctAnswerIndex ? 'Game Mastered!' : 'Keep playing - you\'re learning!'}
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed">{activity.content.explanation}</p>
          </div>
        )}

        {!showResult ? (
          <div className="flex justify-between items-center">
            <div className="text-orange-300">Game Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              Submit Game Answer
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-orange-300 mb-2">Advancing to next phase...</div>
            <div className="w-full bg-orange-800 rounded-full h-2 animate-pulse">
              <div className="bg-orange-400 h-2 rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        )}

        <div className="text-center text-orange-300 mt-6">
          Phase 3 of 6 • Interactive Learning Game
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityInteractiveGame;
