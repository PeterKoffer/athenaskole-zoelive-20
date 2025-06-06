
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { LessonActivity } from '../EnhancedLessonContent';

interface ActivityQuestionProps {
  activity: LessonActivity;
  timeRemaining: number;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityQuestion = ({ activity, timeRemaining, onActivityComplete }: ActivityQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    // Fix: Ensure correct comparison - activity.content.correct should be the correct answer index
    const isCorrect = selectedAnswer === activity.content.correctAnswer || selectedAnswer === activity.content.correct;
    
    console.log('Answer validation:', {
      selectedAnswer,
      correctAnswer: activity.content.correctAnswer || activity.content.correct,
      isCorrect
    });
    
    setTimeout(() => {
      onActivityComplete(isCorrect);
    }, 3000);
  };

  // Get the correct answer index
  const correctAnswerIndex = activity.content.correctAnswer !== undefined 
    ? activity.content.correctAnswer 
    : activity.content.correct;

  return (
    <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Trophy className="w-8 h-8 text-green-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
        </div>
        
        {activity.content.story && (
          <div className="bg-green-800/30 rounded-lg p-4 mb-6">
            <h4 className="text-green-200 font-semibold mb-2">Story:</h4>
            <p className="text-green-100 leading-relaxed">{activity.content.story}</p>
          </div>
        )}
        
        <div className="text-xl text-white mb-6 font-medium">
          {activity.content.question}
        </div>
        
        <div className="space-y-3 mb-6">
          {activity.content.options.map((option: string, index: number) => (
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
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              <span className={`font-bold text-lg ${
                selectedAnswer === correctAnswerIndex ? 'text-green-300' : 'text-red-300'
              }`}>
                {selectedAnswer === correctAnswerIndex ? 'Excellent!' : 'Not quite right!'}
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed">{activity.content.explanation}</p>
          </div>
        )}

        {!showResult ? (
          <div className="flex justify-between items-center">
            <div className="text-green-300">Time: {timeRemaining}s</div>
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-300 mb-2">Moving to next activity...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityQuestion;
