
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityQuestionProps {
  activity: LessonActivity;
  timeRemaining: number;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityQuestion = ({ activity, timeRemaining, onActivityComplete }: ActivityQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  console.log('🎯 ActivityQuestion rendered:', {
    activityId: activity.id,
    activityTitle: activity.title,
    question: activity.content.question?.substring(0, 50),
    hasOptions: !!activity.content.options,
    correctAnswer: activity.content.correctAnswer || activity.content.correct,
    selectedAnswer,
    showResult,
    hasSubmitted
  });

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || hasSubmitted) {
      console.log('🚫 Answer selection blocked - already submitted or showing result');
      return;
    }
    console.log('📝 Answer selected:', answerIndex);
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || hasSubmitted) {
      console.log('🚫 Submit blocked - no answer selected or already submitted');
      return;
    }
    
    setHasSubmitted(true);
    setShowResult(true);
    const correctAnswerIndex = activity.content.correctAnswer !== undefined 
      ? activity.content.correctAnswer 
      : activity.content.correct;
    
    const isCorrect = selectedAnswer === correctAnswerIndex;
    
    console.log('✅ Answer submitted:', {
      selectedAnswer,
      correctAnswer: correctAnswerIndex,
      isCorrect,
      activityId: activity.id
    });

    // Immediately trigger sound effect and progression
    setTimeout(() => {
      console.log('🎯 Calling onActivityComplete with result:', isCorrect);
      onActivityComplete(isCorrect);
    }, 1500); // Short delay to show result
  };

  const handleNextQuestion = () => {
    if (!hasSubmitted) {
      console.log('🚫 Next blocked - not submitted yet');
      return;
    }
    
    const correctAnswerIndex = activity.content.correctAnswer !== undefined 
      ? activity.content.correctAnswer 
      : activity.content.correct;
    const isCorrect = selectedAnswer === correctAnswerIndex;
    
    console.log('🎯 Next question clicked, calling onActivityComplete with:', isCorrect);
    onActivityComplete(isCorrect);
  };

  const correctAnswerIndex = activity.content.correctAnswer !== undefined 
    ? activity.content.correctAnswer 
    : activity.content.correct;

  return (
    <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-400">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mr-3" />
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-green-200 text-xs sm:text-sm">Question ID: {activity.id}</p>
          </div>
        </div>
        
        {activity.content.story && (
          <div className="bg-green-800/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="text-green-200 font-semibold mb-2">Story:</h4>
            <p className="text-green-100 leading-relaxed text-sm sm:text-base">{activity.content.story}</p>
          </div>
        )}
        
        <div className="text-lg sm:text-xl text-white mb-4 sm:mb-6 font-medium leading-relaxed px-2">
          {activity.content.question}
        </div>
        
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {activity.content.options?.map((option: string, index: number) => (
            <Button
              key={`${activity.id}-option-${index}`}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-3 sm:p-4 h-auto transition-all duration-200 text-sm sm:text-base ${
                showResult
                  ? index === correctAnswerIndex
                    ? "bg-green-600 border-green-400 text-white"
                    : selectedAnswer === index
                    ? "bg-red-600 border-red-400 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300"
                  : selectedAnswer === index
                  ? "bg-green-500 text-white transform scale-105"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult || hasSubmitted}
            >
              <span className="mr-2 sm:mr-3 font-bold text-base sm:text-lg">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
              {showResult && index === correctAnswerIndex && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-green-200" />
              )}
              {showResult && selectedAnswer === index && index !== correctAnswerIndex && (
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-red-200" />
              )}
            </Button>
          )) || (
            <div className="text-red-400 p-4 border border-red-600 rounded-lg">
              ⚠️ No options available for this question
            </div>
          )}
        </div>

        {showResult && (
          <div className={`p-3 sm:p-4 rounded-lg mb-4 mx-2 ${
            selectedAnswer === correctAnswerIndex 
              ? 'bg-green-800/50 border border-green-600' 
              : 'bg-red-800/50 border border-red-600'
          }`}>
            <div className="flex items-center mb-2">
              {selectedAnswer === correctAnswerIndex ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-2" />
              )}
              <span className={`font-bold text-base sm:text-lg ${
                selectedAnswer === correctAnswerIndex ? 'text-green-300' : 'text-red-300'
              }`}>
                {selectedAnswer === correctAnswerIndex ? 'Excellent! 🎉' : 'Not quite right! 📚'}
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{activity.content.explanation}</p>
            {!hasSubmitted && (
              <p className="text-gray-400 text-xs mt-2">Moving to next question...</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 px-2">
          <div className="text-green-300 text-sm sm:text-base order-2 sm:order-1">
            Time: {timeRemaining}s
          </div>
          
          {!showResult ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null || hasSubmitted}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg order-1 sm:order-2"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!hasSubmitted}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg order-1 sm:order-2"
            >
              Continue to Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityQuestion;
