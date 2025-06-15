
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';
import Blackboard from '../shared/Blackboard';

interface ActivityInteractiveQuizProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityInteractiveQuiz = ({
  activity,
  onActivityComplete
}: ActivityInteractiveQuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult]);

  const handleTimeUp = () => {
    setShowResult(true);
    setScore(0);
    setTimeout(() => {
      onActivityComplete(false);
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === activity.content?.correctAnswer;
    const earnedScore = isCorrect ? timeLeft * 10 : 0;
    setScore(earnedScore);
    
    setTimeout(() => {
      onActivityComplete(isCorrect);
    }, 3000);
  };

  const question = activity.content?.question || activity.title;
  const options = activity.content?.options || [];
  const battleScenario = activity.content?.battleScenario;
  const explanation = activity.content?.explanation;

  return (
    <Blackboard>
      <div className="space-y-6">
        {/* Epic Header with Timer */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            {activity.title}
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-bold ${
              timeLeft > 10 ? 'bg-green-500 text-white' : 
              timeLeft > 5 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white animate-pulse'
            }`}>
              ⏰ {timeLeft}s
            </div>
            {score > 0 && (
              <div className="bg-gold-500 text-black px-4 py-2 rounded-full font-bold">
                💰 {score} pts
              </div>
            )}
          </div>
        </div>

        {/* Battle Context */}
        {battleScenario && (
          <div className="bg-purple-900/50 border border-purple-400 rounded-lg p-4 text-center">
            <p className="text-purple-200 font-medium text-lg">{battleScenario}</p>
          </div>
        )}

        {/* Question */}
        <div className="bg-blue-900/30 rounded-lg p-6 border border-blue-400/30">
          <p className="text-white text-xl leading-relaxed">{question}</p>
        </div>

        {/* Interactive Options */}
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option: string, index: number) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-6 text-lg h-auto transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 shadow-lg transform scale-105'
                    : 'bg-gray-700 hover:bg-gray-600 border border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-white">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={`text-6xl mb-4 ${selectedAnswer === activity.content?.correctAnswer ? '🎉' : '💀'}`}>
              {selectedAnswer === activity.content?.correctAnswer ? '🎉' : '💀'}
            </div>
            <div className={`text-2xl font-bold ${
              selectedAnswer === activity.content?.correctAnswer 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {selectedAnswer === activity.content?.correctAnswer 
                ? 'VICTORY!' 
                : 'DEFEATED!'}
            </div>
            {explanation && (
              <div className="bg-gray-800 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-gray-300">{explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all"
            >
              ⚔️ ATTACK!
            </Button>
          </div>
        )}
      </div>
    </Blackboard>
  );
};

export default ActivityInteractiveQuiz;
