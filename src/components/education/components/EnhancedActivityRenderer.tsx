
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { LessonActivity } from './types/LessonTypes';

interface EnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady: boolean;
}

const EnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady
}: EnhancedActivityRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  console.log('🎭 EnhancedActivityRenderer rendering:', {
    activityId: activity.id,
    activityType: activity.type,
    activityPhase: activity.phase,
    activityTitle: activity.title,
    hasContent: !!activity.content,
    contentStructure: {
      correctAnswer: activity.content.correctAnswer,
      correct: activity.content.correct,
      options: activity.content.options?.length || 0,
      segments: activity.content.segments?.length || 0
    }
  });

  // Helper function to get the correct answer index consistently
  const getCorrectAnswerIndex = () => {
    // Direct correctAnswer property
    if (activity.content.correctAnswer !== undefined) {
      console.log('✅ Found correctAnswer:', activity.content.correctAnswer);
      return activity.content.correctAnswer;
    }
    
    // Alternative 'correct' property
    if (activity.content.correct !== undefined) {
      console.log('✅ Found correct:', activity.content.correct);
      return activity.content.correct;
    }
    
    // Fallback for content-delivery phase with segments
    if (activity.content.segments?.[0]?.checkQuestion?.correctAnswer !== undefined) {
      console.log('✅ Found segment correctAnswer:', activity.content.segments[0].checkQuestion.correctAnswer);
      return activity.content.segments[0].checkQuestion.correctAnswer;
    }
    
    console.warn('⚠️ No correct answer found for activity:', activity.id, 'Content:', activity.content);
    return 0; // Default fallback
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
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    console.log('🎯 Answer selected:', answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
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

  // Render based on activity type and phase
  if (activity.phase === 'introduction') {
    return (
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-gray-700">
        <CardContent className="p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{activity.title}</h2>
          <p className="text-xl mb-6 text-gray-200">
            {activity.content.hook || 'Welcome to your lesson!'}
          </p>
          <Button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3"
          >
            Let's Begin!
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (activity.phase === 'content-delivery') {
    const segment = activity.content.segments?.[0];
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>{activity.title}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAudio(segment?.explanation || activity.content.text || '')}
              className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              {segment?.concept || 'Learning Content'}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              {segment?.explanation || activity.content.text || 'Content coming soon...'}
            </p>
          </div>
          
          {segment?.checkQuestion && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">
                {segment.checkQuestion.question}
              </h4>
              
              <div className="space-y-3">
                {segment.checkQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full text-left justify-start p-4 h-auto ${
                      selectedAnswer === index
                        ? "bg-green-500 text-white"
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
                    {selectedAnswer === segment.checkQuestion.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className={`font-semibold ${
                      selectedAnswer === segment.checkQuestion.correctAnswer 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {selectedAnswer === segment.checkQuestion.correctAnswer ? 'Excellent!' : 'Try again next time!'}
                    </p>
                  </div>
                  <p className="text-gray-300">
                    {segment.checkQuestion.explanation}
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
            </div>
          )}
          
          {!segment?.checkQuestion && (
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (activity.phase === 'interactive-game' || activity.type === 'interactive-game') {
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
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  selectedAnswer === index
                    ? "bg-green-500 text-white"
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
  }

  // Default fallback for any other activity type
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 text-center text-white">
        <h3 className="text-xl font-semibold mb-4">{activity.title}</h3>
        <p className="text-gray-300 mb-6">
          {activity.content.text || activity.content.hook || 'Activity content loading...'}
        </p>
        <Button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedActivityRenderer;
