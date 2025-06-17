
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { LessonActivity } from '../types/LessonTypes';
import Blackboard from '../shared/Blackboard';

interface StableActivityInteractiveQuizProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const StableActivityInteractiveQuiz = ({
  activity,
  onActivityComplete
}: StableActivityInteractiveQuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  // Extract stable content once and never re-compute - this prevents ALL flickering
  const stableContent = useMemo(() => {
    console.log('🔒 Creating STABLE content object for activity:', activity.id);
    
    if (!activity.content?.question || !activity.content?.options) {
      return null;
    }

    // Return a completely stable object that will never change reference
    return {
      question: activity.content.question,
      options: activity.content.options,
      correctAnswer: activity.content.correctAnswer,
      explanation: activity.content.explanation,
      battleScenario: activity.content.battleScenario,
      title: activity.title,
      activityId: activity.id // Include ID for debugging
    };
  }, [activity.id]); // Only depend on ID - content should never change for same ID

  console.log('🎯 StableActivityInteractiveQuiz render:', {
    activityId: activity.id,
    hasStableContent: !!stableContent,
    contentKeys: stableContent ? Object.keys(stableContent) : [],
    showResult,
    selectedAnswer,
    renderTime: Date.now()
  });

  // Reset state when activity changes (new question)
  useEffect(() => {
    console.log('🔄 Resetting quiz state for new activity:', activity.id);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setScore(0);
  }, [activity.id]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && stableContent) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && stableContent) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, stableContent]);

  const handleTimeUp = () => {
    console.log('⏰ Time up! Auto-completing activity');
    setShowResult(true);
    setScore(0);
    setTimeout(() => {
      console.log('🚀 Auto-advancing after time up');
      onActivityComplete(false);
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult && stableContent) {
      console.log('📝 Answer selected:', answerIndex);
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !stableContent) return;
    
    console.log('✅ Submitting answer:', selectedAnswer, 'Correct:', stableContent.correctAnswer);
    setShowResult(true);
    const isCorrect = selectedAnswer === stableContent.correctAnswer;
    const earnedScore = isCorrect ? timeLeft * 10 : 0;
    setScore(earnedScore);
    
    setTimeout(() => {
      console.log('🚀 Activity completed, advancing:', isCorrect);
      onActivityComplete(isCorrect);
    }, 3000);
  };

  // Don't render until content is stable
  if (!stableContent) {
    console.log('⏳ Waiting for stable content...');
    return (
      <Blackboard>
        <div className="text-center text-white p-8">
          <div className="text-2xl mb-4">⏳</div>
          <p className="text-xl">Loading question...</p>
        </div>
      </Blackboard>
    );
  }

  console.log('🎮 Rendering stable quiz with state:', { 
    selectedAnswer, 
    showResult, 
    timeLeft, 
    score,
    question: stableContent.question.substring(0, 30) + '...'
  });

  return (
    <Blackboard>
      <div className="space-y-6">
        {/* Fixed Header with Better Contrast */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
            {stableContent.title}
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-bold ${
              timeLeft > 10 ? 'bg-green-500 text-white' : 
              timeLeft > 5 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
            }`}>
              ⏰ {timeLeft}s
            </div>
            {score > 0 && (
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                💰 {score} pts
              </div>
            )}
          </div>
        </div>

        {/* Battle Context */}
        {stableContent.battleScenario && (
          <div className="bg-purple-900/50 border border-purple-400 rounded-lg p-6 text-center">
            <p className="text-purple-200 font-medium text-xl">{stableContent.battleScenario}</p>
          </div>
        )}

        {/* Question with Better Contrast */}
        <div className="bg-slate-800/90 rounded-lg p-6 border-2 border-blue-400/50">
          <p className="text-white text-xl leading-relaxed font-semibold">{stableContent.question}</p>
        </div>

        {/* Completely Stable Answer Options - Zero Flickering */}
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stableContent.options.map((option: string, index: number) => (
              <Button
                key={`${stableContent.activityId}-option-${index}`} // Ultra-stable key
                onClick={() => handleAnswerSelect(index)}
                className={`p-6 text-lg h-auto transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 text-white font-bold transform scale-105'
                    : 'bg-gray-700 hover:bg-gray-600 border border-gray-500 text-white hover:scale-102'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-white font-medium">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-8xl mb-4">
              {selectedAnswer === stableContent.correctAnswer ? '🎉' : '💀'}
            </div>
            <div className={`text-3xl font-bold ${
              selectedAnswer === stableContent.correctAnswer 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {selectedAnswer === stableContent.correctAnswer 
                ? 'VICTORY! 🏆' 
                : 'DEFEATED! ⚔️'}
            </div>
            {stableContent.explanation && (
              <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-gray-300 text-lg">{stableContent.explanation}</p>
              </div>
            )}
            <div className="text-gray-400 text-lg">
              Next adventure begins in 3 seconds...
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 text-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Submit Answer
            </Button>
          </div>
        )}
      </div>
    </Blackboard>
  );
};

export default StableActivityInteractiveQuiz;
